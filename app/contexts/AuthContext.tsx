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

  const getInitialSession = async () => {
    try {
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 10000)

      loadingTimeoutRef.current = timeout

      const currentUser = await getCurrentUser()
      setUser(currentUser)

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

  const checkAndUpdateUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      const currentUserId = user?.id
      const newUserId = currentUser?.id

      if (currentUser && currentUserId !== newUserId) {
        setUser(currentUser)
        setLoading(false)
      } else if (!currentUser && user) {
        setUser(null)
        setLoading(false)
      } else if (currentUser && user && currentUserId === newUserId) {
        const profileChanged = JSON.stringify(user.profile) !== JSON.stringify(currentUser.profile)
        if (profileChanged) {
          setUser(currentUser)
        }
      }
    } catch (error) {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
            case 'USER_UPDATED':
              if (session?.user) {
                try {
                  const timeoutPromise = new Promise<null>((resolve) => {
                    setTimeout(() => resolve(null), 5000)
                  })

                  const currentUser = await Promise.race([
                    getCurrentUser(),
                    timeoutPromise
                  ])

                  if (currentUser) {
                    setUser(currentUser)
                  } else {
                    const userMetadata = session.user.user_metadata
                    const fullName = userMetadata?.full_name || session.user.email || 'User'
                    const username = userMetadata?.username || session.user.email?.split('@')[0] || 'user'

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
                  const userMetadata = session.user.user_metadata
                  const fullName = userMetadata?.full_name || session.user.email || 'User'
                  const username = userMetadata?.username || session.user.email?.split('@')[0] || 'user'

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
              setLoading(false)
              break

            case 'SIGNED_OUT':
              setUser(null)
              setLoading(false)
              break

            case 'MFA_CHALLENGE_VERIFIED':
            case 'PASSWORD_RECOVERY':
              break

            default:
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

    const intervalId = setInterval(async () => {
      try {
        await checkAndUpdateUser()
      } catch (error) {
        // Periodic check failed
      }
    }, 30000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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

      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [checkAndUpdateUser])

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

      setUser(null)
      setLoading(false)
      
    } catch (error) {
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
