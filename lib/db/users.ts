import { db, users, type NewUser, type User } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { generateApiKey } from "../utils"

export async function findUserByProviderAccount(provider: string, providerUserId: string): Promise<User | null> {
  try {
    console.log(`Looking for user with provider: ${provider}, providerUserId: ${providerUserId}`)

    if (!db) {
      throw new Error("Database connection not available")
    }

    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, provider), eq(users.providerUserId, providerUserId)))
      .limit(1)

    console.log(`Found ${result.length} users`)
    return result[0] || null
  } catch (error) {
    console.error("Error finding user by provider account:", error)
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)

    return result[0] || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  provider: string
  providerUserId: string
  isAdmin?: boolean
}): Promise<User | null> {
  try {
    console.log(`Creating user: ${userData.email}`)

    if (!db) {
      throw new Error("Database connection not available")
    }

    const apiKey = generateApiKey()

    const newUser: NewUser = {
      email: userData.email,
      provider: userData.provider,
      providerUserId: userData.providerUserId,
      apiKey,
      isAdmin: userData.isAdmin || false,
    }

    const result = await db.insert(users).values(newUser).returning()

    console.log(`New user created: ${userData.email} via ${userData.provider}`)
    return result[0] || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUserLastLogin(userId: number): Promise<void> {
  try {
    // You can add a lastLoginAt field to your schema if needed
    console.log(`User ${userId} logged in at ${new Date().toISOString()}`)
  } catch (error) {
    console.error("Error updating user last login:", error)
  }
}
