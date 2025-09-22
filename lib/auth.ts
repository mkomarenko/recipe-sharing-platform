import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'
import type { Profile } from './supabase'

export interface AuthUser extends User {
  profile?: Profile | null
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

export async function signUp({ email, password, username, full_name }: SignUpData) {
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
    await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username,
        full_name,
      })
  }

  return data
}

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

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      return null
    }

    if (!session?.user) {
      return null
    }

    const user = session.user
    const userMetadata = user.user_metadata
    const basicProfile: Profile = {
      id: user.id,
      username: userMetadata?.username || user.email?.split('@')[0] || 'user',
      full_name: userMetadata?.full_name || user.email || 'User',
      avatar_url: userMetadata?.avatar_url || undefined,
      bio: userMetadata?.bio || undefined,
      website: userMetadata?.website || undefined,
      location: userMetadata?.location || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = {
      ...user,
      profile: basicProfile,
    }

    let profile = null
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      })

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
      result.profile = {
        id: profile.id,
        username: profile.username || basicProfile.username,
        full_name: profile.full_name || basicProfile.full_name,
        avatar_url: profile.avatar_url || basicProfile.avatar_url,
        bio: profile.bio || basicProfile.bio,
        website: profile.website || basicProfile.website,
        location: profile.location || basicProfile.location,
        created_at: profile.created_at || basicProfile.created_at,
        updated_at: profile.updated_at || basicProfile.updated_at,
      }
    }

    return result
  } catch (error) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const user = session.user
        const userMetadata = user.user_metadata
        const basicProfile: Profile = {
          id: user.id,
          username: userMetadata?.username || user.email?.split('@')[0] || 'user',
          full_name: userMetadata?.full_name || user.email || 'User',
          avatar_url: userMetadata?.avatar_url || undefined,
          bio: userMetadata?.bio || undefined,
          website: userMetadata?.website || undefined,
          location: userMetadata?.location || undefined,
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

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
}
