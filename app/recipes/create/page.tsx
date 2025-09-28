'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/app/components'
import { useAuth } from '@/app/contexts/AuthContext'
import CreateRecipeForm from '@/app/components/recipes/CreateRecipeForm'

export default function CreateRecipePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        router.push('/auth/login?redirectTo=/recipes/create')
      }
    }, 15000) // 15 second timeout

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      clearTimeout(timeout)
      router.push('/auth/login?redirectTo=/recipes/create')
    }

    return () => clearTimeout(timeout)
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
            <p className="text-gray-600">Please wait while we redirect you to login.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="py-8">
        <CreateRecipeForm />
      </div>
    </div>
  )
}