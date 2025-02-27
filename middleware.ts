import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: Request) {
  const session = await auth()
  
  // Check if trying to access admin pages
  if (request.url.includes('/admin')) {
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

