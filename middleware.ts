import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Middleware temporarily disabled - auth redirects handled client-side
  // in /app/auth/login/page.tsx and /app/auth/register/page.tsx
  return NextResponse.next()
}

export const config = {
  matcher: [],
}