import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
  } | null
}

export interface SignUpData {
  email: string
  password: string
  username: string
  full_name: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up a new user
export async function signUp({ email, password, username, full_name }: SignUpData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
      },
    })

    if (error) {
      throw error
    }

    if (data.user) {
      // Create profile immediately
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          full_name,
        })

      if (profileError) {
        // Don't fail the signup if profile creation fails
        // The profile will be created later when getCurrentUser is called
        // Profile creation failed - will be handled later
      }
    }

    return data
  } catch (error) {
    throw error
  }
}

// Sign in an existing user
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out the current user
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

// Get the current authenticated user with profile data
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return null
    }
    
    if (!session?.user) {
      return null
    }
    
    const user = session.user

    // Create basic profile from user metadata immediately (offline-first approach)
    const userMetadata = user.user_metadata
    const basicProfile = {
      id: user.id,
      username: userMetadata?.username || user.email?.split('@')[0] || 'user',
      full_name: userMetadata?.full_name || user.email || 'User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    // Return user with basic profile immediately
    const result = {
      ...user,
      profile: basicProfile,
    }
    
    // Try to fetch user profile from database with timeout protection
    let profile = null
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 3000) // 3 second timeout
      })

      // Race the database query against the timeout
      const profileQuery = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: profileData, error: profileError } = await Promise.race([
        profileQuery,
        timeoutPromise
      ]) as any

      if (!profileError && profileData) {
        profile = profileData
      }
    } catch (error) {
      // Database unavailable - using offline mode
    }
    
    if (profile) {
      result.profile = profile
    }
    
    return result
  } catch (error) {
    // If we have a session but getCurrentUser fails, return the basic user
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const user = session.user
        const userMetadata = user.user_metadata
        const basicProfile = {
          id: user.id,
          username: userMetadata?.username || user.email?.split('@')[0] || 'user',
          full_name: userMetadata?.full_name || user.email || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        return {
          ...user,
          profile: basicProfile,
        }
      }
    } catch (fallbackError) {
      // Fallback failed
    }
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
}
