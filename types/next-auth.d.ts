import type { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      dbId: string
      apiKey: string
      isAdmin: boolean
      provider: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    dbId?: string
    apiKey?: string
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    dbId?: string
    apiKey?: string
    isAdmin?: boolean
    provider?: string
  }
}
