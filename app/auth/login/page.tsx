'use client'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import LoginForm from '@/app/components/auth/LoginForm'

function LoginFormWrapper() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 w-full rounded-lg"></div>}>
      <LoginForm />
    </Suspense>
  )
}

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!loading && user) {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo')
      const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'
      router.push(destination)
    }
  }, [user, loading, router])

  // Show loading while checking auth or if redirecting
  if (loading || (!loading && user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginFormWrapper />
      </div>
    </div>
  )
}
