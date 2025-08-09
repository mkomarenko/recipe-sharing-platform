'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SignOutButtonProps {
  onSignOut?: () => void
  className?: string
  children?: React.ReactNode
}

export default function SignOutButton({ onSignOut, className, children }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    try {
      // Direct call to Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      // Call optional callback
      if (onSignOut) {
        onSignOut()
      }
      
      // Force reload to clear all state
      window.location.href = '/'
      
    } catch {
      alert('Failed to sign out. Please try again.')
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
