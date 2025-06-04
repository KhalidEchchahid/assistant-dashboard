import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { createUser, findUserByProviderAccount, updateUserLastLogin } from "./lib/db/users"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered", { user: user.email, provider: account?.provider })

      if (!account || !user.email) {
        console.log("Missing account or email")
        return false
      }

      try {
        // Check if user already exists in our database
        console.log("Checking for existing user...")
        const existingUser = await findUserByProviderAccount(account.provider, account.providerAccountId)

        if (!existingUser) {
          console.log("Creating new user...")
          // Create new user in database
          const newUser = await createUser({
            email: user.email,
            provider: account.provider,
            providerUserId: account.providerAccountId,
            isAdmin: false, // Set to true for specific admin emails if needed
          })

          if (!newUser) {
            console.error("Failed to create user in database")
            return false
          }

          console.log("New user created successfully")
          // Add database user info to the session user
          user.dbId = newUser.id.toString()
          user.apiKey = newUser.apiKey
        } else {
          console.log("Existing user found")
          // User exists, update last login and add info to session
          await updateUserLastLogin(existingUser.id)
          user.dbId = existingUser.id.toString()
          user.apiKey = existingUser.apiKey
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (user) {
        token.dbId = user.dbId
        token.apiKey = user.apiKey
        token.isAdmin = user.isAdmin
        token.provider = account?.provider
      }
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.dbId = token.dbId as string
        session.user.apiKey = token.apiKey as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.provider = token.provider as string
      }
      return session
    },
  },
})
