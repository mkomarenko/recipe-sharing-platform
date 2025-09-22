'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

interface SignOutButtonProps {
  onSignOut?: () => void
  className?: string
  children?: React.ReactNode
}

export default function SignOutButton({ onSignOut, className, children }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      // Use the AuthContext signOut method
      await signOut()

      // Call optional callback
      if (onSignOut) {
        onSignOut()
      }

      // Force reload to clear all state
      window.location.href = '/'

    } catch (error) {
      // Even if there's an error, try to clear state and redirect
      
      if (onSignOut) {
        onSignOut()
      }
      
      window.location.href = '/'
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Signing Out...' : (children || 'Sign Out')}
    </button>
  )
}
