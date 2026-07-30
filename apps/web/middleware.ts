import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (searchParams.get('motion') === 'off') {
    const res = NextResponse.next()
    res.cookies.set('lensqa_motion', 'off', { path: '/' })
    return res
  }
  // ponytail: demo mode — dashboard accessible without auth when DEMO_MODE != 0
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/projects') || pathname.startsWith('/runs') || pathname.startsWith('/review') || pathname.startsWith('/analytics') || pathname.startsWith('/settings') || pathname.startsWith('/onboarding')) {
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
