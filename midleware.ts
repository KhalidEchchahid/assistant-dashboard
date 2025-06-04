import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // If the user is not logged in and trying to access a protected route
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/auth/login", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
