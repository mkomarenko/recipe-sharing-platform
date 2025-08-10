import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Update the request cookies
          req.cookies.set({
            name,
            value,
            ...options,
          })
          // Update the response cookies
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Update the request cookies
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          // Update the response cookies
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // Define route categories
  const protectedRoutes = ['/dashboard', '/recipes/create', '/recipes/edit', '/profile']
  const authRoutes = ['/auth/login', '/auth/register']
  const publicAuthRoutes = ['/auth/confirm'] // Routes that don't require redirects

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isPublicAuthRoute = publicAuthRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // For email confirmation routes, always allow access regardless of auth state
  if (isPublicAuthRoute) {
    return res
  }

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo')
    const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'
    return NextResponse.redirect(new URL(destination, req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
