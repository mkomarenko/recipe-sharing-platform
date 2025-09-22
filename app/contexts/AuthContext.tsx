'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser, getCurrentUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, full_name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get initial session
  const getInitialSession = async () => {
    try {
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 10000) // 10 second timeout
      
      loadingTimeoutRef.current = timeout
      
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      // Clear timeout if successful
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Function to manually check and update user state
  const checkAndUpdateUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()

      if (currentUser && (!user || user.id !== currentUser.id)) {
        setUser(currentUser)
        setLoading(false)
      } else if (!currentUser && user) {
        setUser(null)
        setLoading(false)
      }
    } catch (error) {
      // Don't clear user on connection errors, only on auth errors
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    getInitialSession()

    // Listen for auth changes with comprehensive event handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        try {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
            case 'USER_UPDATED':
              if (session?.user) {
                try {
                  // Add timeout to getCurrentUser call to prevent hanging
                  const timeoutPromise = new Promise<null>((resolve) => {
                    setTimeout(() => {
                      resolve(null)
                    }, 5000) // 5 second timeout
                  })

                  const currentUser = await Promise.race([
                    getCurrentUser(),
                    timeoutPromise
                  ])

                  if (currentUser) {
                    setUser(currentUser)
                  } else {
                    // Fallback to basic user data with profile
                    const userMetadata = session.user.user_metadata
                    const fullName = userMetadata?.full_name || session.user.email || 'User'
                    const username = userMetadata?.username || session.user.email?.split('@')[0] || 'user'

                    // Create a basic profile without database call
                    const basicProfile = {
                      id: session.user.id,
                      username: username,
                      full_name: fullName,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }

                    setUser({
                      ...session.user,
                      profile: basicProfile,
                    } as AuthUser)
                  }
                } catch (error) {
                  // Fallback to basic user data with profile
                  const userMetadata = session.user.user_metadata
                  const fullName = userMetadata?.full_name || session.user.email || 'User'
                  const username = userMetadata?.username || session.user.email?.split('@')[0] || 'user'
                  
                  // Create a basic profile without database call
                  const basicProfile = {
                    id: session.user.id,
                    username: username,
                    full_name: fullName,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }
                  
                  setUser({
                    ...session.user,
                    profile: basicProfile,
                  } as AuthUser)
                }
              }
              // Always set loading to false for these events
              setLoading(false)
              break
              
            case 'SIGNED_OUT':
              setUser(null)
              setLoading(false)
              break
              
            case 'MFA_CHALLENGE_VERIFIED':
              // Handle MFA if needed
              break
              
            case 'PASSWORD_RECOVERY':
              // Handle password recovery
              break
              
            default:
              // For any other events, try to get the current session
              if (session?.user) {
                try {
                  const currentUser = await getCurrentUser()
                  if (currentUser) {
                    setUser(currentUser)
                    setLoading(false)
                  }
                } catch (error) {
                  setLoading(false)
                }
              } else {
                setLoading(false)
              }
          }
        } catch (error) {
          setLoading(false)
        }
      }
    )

    // Set up a periodic check for user state changes (fallback for missed events)
    const intervalId = setInterval(async () => {
      try {
        await checkAndUpdateUser()
      } catch (error) {
        // Periodic check failed
      }
    }, 30000) // Increased to 30 seconds to reduce spam

    // Handle browser visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Browser became visible, check user state
        // Add a small delay to avoid race conditions
        setTimeout(() => {
          checkAndUpdateUser()
        }, 1000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Clear loading timeout if it exists
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [checkAndUpdateUser]) // Include checkAndUpdateUser dependency

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setLoading(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, username: string, full_name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
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

      // User will be automatically set via the auth state change listener
      // The profile will be created in the lib/auth.ts signUp function
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear user state immediately
      setUser(null)
      setLoading(false)
      
    } catch (error) {
      // Even if signOut fails, clear the user state
      setUser(null)
      setLoading(false)
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      setLoading(true)
      
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
