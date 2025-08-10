'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthDebugPanel() {
  const { user, loading, refreshSession } = useAuth()
  const [showPanel, setShowPanel] = useState(false)

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        title="Toggle Debug Panel"
      >
        🐛
      </button>

      {/* Debug panel */}
      {showPanel && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
          <h3 className="font-bold text-sm text-gray-800 mb-2">🔍 Auth Debug Panel</h3>
          
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                loading ? 'bg-yellow-100 text-yellow-800' : 
                user ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            
            {user && (
              <>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-gray-600">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium">Profile:</span>
                  <span className="ml-2 text-gray-600">
                    {user.profile ? 'Loaded' : 'Not loaded'}
                  </span>
                </div>
                {user.profile && (
                  <div>
                    <span className="font-medium">Username:</span>
                    <span className="ml-2 text-gray-600">{user.profile.username}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <button
              onClick={refreshSession}
              className="w-full bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
            >
              🔄 Refresh Session
            </button>
            
            <button
              onClick={() => {
                // Debug info logged to console in development only
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔍 Current auth state:', { user, loading })
                  console.log('🔍 Supabase session:', supabase.auth.getSession())
                }
              }}
              className="w-full bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
            >
              📝 Log to Console
            </button>
          </div>
        </div>
      )}
    </>
  )
}
