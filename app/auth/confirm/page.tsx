'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ConfirmEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your email...')
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    let progressInterval: NodeJS.Timeout
    let authListener: { data: { subscription: { unsubscribe: () => void } } }
    let redirectTimeout: NodeJS.Timeout
    let fallbackTimeout: NodeJS.Timeout

    const startConfirmation = async () => {
      try {
        // Start progress animation
        progressInterval = setInterval(() => {
          if (mounted && progressRef.current < 90) {
            progressRef.current += 2
            setProgress(Math.min(progressRef.current, 90))
          }
        }, 200)

        // Listen for auth state changes
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted && session?.user) {
            // Session established successfully
            clearInterval(progressInterval)
            clearTimeout(fallbackTimeout)
            setProgress(100)
            setStatus('success')
            setMessage('Email confirmed successfully! You are now signed in.')

            // Redirect immediately without depending on AuthContext
            redirectTimeout = setTimeout(() => {
              if (mounted) {
                router.push('/dashboard')
              }
            }, 1500) // Reduced from 2000ms to 1500ms for faster redirect
          }
        })

        // Fallback timeout with redirect option
        fallbackTimeout = setTimeout(() => {
          if (mounted) {
            clearInterval(progressInterval)

            // Check if we have a valid session before showing error
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                // We have a valid session, redirect anyway
                setProgress(100)
                setStatus('success')
                setMessage('Email confirmed successfully! You are now signed in.')
                setTimeout(() => {
                  if (mounted) {
                    router.push('/dashboard')
                  }
                }, 1000)
              } else {
                // No session, show error
                setStatus('error')
                setMessage('Email confirmation timed out. Please try refreshing the page.')
              }
            }).catch(() => {
              // Error getting session, show error
              setStatus('error')
              setMessage('Email confirmation timed out. Please try refreshing the page.')
            })
          }
        }, 10000) // Reduced to 10 seconds for faster fallback
        
      } catch (error) {
        if (mounted) {
          clearInterval(progressInterval)
          setStatus('error')
          setMessage('An unexpected error occurred')
        }
      }
    }

    // Start the confirmation process
    startConfirmation()

    return () => {
      mounted = false
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe()
      }
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
      }
    }
  }, [router]) // Remove status dependency to prevent re-running

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
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
          
          {status === 'loading' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{message}</p>
              <p className="text-xs text-gray-500">This may take a few moments...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Redirecting you to the dashboard...
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Go to Dashboard Now
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-red-500">
                Please try refreshing the page or contact support if the issue persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Refresh Page
              </button>
            </div>
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
