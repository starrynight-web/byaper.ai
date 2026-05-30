import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/auth/callback']
const API_PATHS = ['/api/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow public paths, static files, and API routes
  if (
    API_PATHS.some(p => pathname.startsWith(p)) ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check for our JWT cookie (set by FastAPI backend)
  const token = request.cookies.get('access_token')?.value
  // Also allow demo mode
  const demoMode = request.cookies.get('demo_mode')?.value === 'true'

  if (!token && !demoMode) {
    // Not authenticated — redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated — allow through
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
