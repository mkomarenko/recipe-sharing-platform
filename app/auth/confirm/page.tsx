'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/contexts/AuthContext'

function ConfirmEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [paramsReady, setParamsReady] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()

  // Check if search parameters are ready
  useEffect(() => {
    const checkParams = () => {
      const hasParams = searchParams.size > 0 || 
        (typeof window !== 'undefined' && window.location.search.length > 0)
      
      if (hasParams && !paramsReady) {
        setParamsReady(true)
      }
    }

    // Check immediately
    checkParams()
    
    // Also check after a small delay to ensure hydration
    const timer = setTimeout(checkParams, 100)
    
    return () => clearTimeout(timer)
  }, [searchParams, paramsReady])

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        let token = searchParams.get('token')
        let type = searchParams.get('type')
        let access_token = searchParams.get('access_token')
        let code = searchParams.get('code')

        // If searchParams are not available yet, try to get them from window.location
        if (!token && !type && !access_token && !code) {
          const urlParams = new URLSearchParams(window.location.search)
          token = urlParams.get('token')
          type = urlParams.get('type')
          access_token = urlParams.get('access_token')
          code = urlParams.get('code')
        }

        // Check if we have any parameters at all
        if (!token && !type && !access_token && !code) {
          setStatus('error')
          setMessage('Invalid confirmation link - no parameters found')
          return
        }

        let verificationResult
        
        if (code) {
          try {
            // For PKCE flow, let Supabase handle the session detection automatically
            // The code parameter will be processed by detectSessionInUrl
            
            // Check if we're in a browser environment and have access to storage
            if (typeof window !== 'undefined') {
              const hasLocalStorage = !!window.localStorage
              const hasSessionStorage = !!window.sessionStorage
            }
            
            // Verify Supabase client is properly initialized
            if (!supabase.auth) {
              setStatus('error')
              setMessage('Authentication service not available')
              return
            }
            
            // Try multiple times to get the session, as PKCE processing can take time
            let session = null
            let attempts = 0
            const maxAttempts = 3
            
            while (!session && attempts < maxAttempts) {
              attempts++
              
              // Give Supabase time to process the PKCE flow
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // Try to get the session that should have been established by detectSessionInUrl
              const { data: { session: currentSession }, error } = await supabase.auth.getSession()
              
              if (error) {
                if (attempts === maxAttempts) {
                  setStatus('error')
                  setMessage('Invalid confirmation code')
                  return
                }
                continue
              }
              
              if (currentSession?.user) {
                session = currentSession
                break
              }
            }
            
            if (session?.user) {
              verificationResult = { data: { user: session.user }, error: null }
            } else {
              setStatus('error')
              setMessage('Failed to establish session from confirmation code')
              return
            }
          } catch (exchangeError) {
            setStatus('error')
            setMessage('Failed to verify confirmation code')
            return
          }
        } else if (access_token) {
          const { data, error } = await supabase.auth.getUser(access_token)
          if (error) {
            setStatus('error')
            setMessage('Invalid confirmation link')
            return
          }
          verificationResult = { data: { user: data.user }, error: null }
        } else if (token && type === 'signup') {
          verificationResult = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })
        } else {
          setStatus('error')
          setMessage('Invalid confirmation link')
          return
        }

        if (verificationResult.error) {
          setStatus('error')
          setMessage(verificationResult.error.message || 'Failed to confirm email')
          return
        }

        if (verificationResult.data.user) {
          setStatus('success')
          setMessage('Email confirmed successfully! You are now signed in.')
          
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            if (sessionError) {
              // Session error handled silently
            }
          } catch (error) {
            // Session refresh error handled silently
          }
        }
      } catch (error) {
        setStatus('error')
        setMessage('An unexpected error occurred')
      }
    }

    // Only proceed if paramsReady is true
    if (paramsReady) {
      handleEmailConfirmation()
    }
  }, [searchParams, paramsReady])

  useEffect(() => {
    if (status === 'success' && !authLoading && user) {
      router.push('/dashboard')
    }
  }, [status, authLoading, user, router])

  if (!paramsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Preparing email confirmation...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we process your confirmation link.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          )}
          {status === 'success' && (
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          )}
          {status === 'error' && (
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          )}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'loading' ? 'Confirming your email...' : message}
          </h2>
          {status === 'success' && (
            <p className="mt-2 text-sm text-gray-600">
              You will be redirected to the dashboard shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-500">
              Please try again or contact support if the issue persists.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
