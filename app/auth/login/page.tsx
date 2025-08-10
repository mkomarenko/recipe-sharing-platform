import { Suspense } from 'react'
import LoginForm from '@/app/components/auth/LoginForm'

function LoginFormWrapper() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 w-full rounded-lg"></div>}>
      <LoginForm />
    </Suspense>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginFormWrapper />
      </div>
    </div>
  )
}
