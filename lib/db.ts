import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core"

// Database connection
const connectionString =
  "postgresql://assistant_owner:npg_iQMN8cpRxuX4@ep-long-snowflake-a98q49g6-pooler.gwc.azure.neon.tech/assistant?sslmode=require"

console.log("Initializing database connection...")

const sql = neon(connectionString)
export const db = drizzle(sql)

// Test the connection
async function testConnection() {
  try {
    await sql`SELECT 1`
    console.log("Database connection successful")
  } catch (error) {
    console.error("Database connection failed:", error)
  }
}

// Call test connection (only in development)
if (process.env.NODE_ENV === "development") {
  testConnection()
}

// User schema (already exists)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  provider: text("provider").notNull(), // 'github' or 'google'
  providerUserId: text("provider_user_id").notNull(),
  apiKey: text("api_key").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Website schema
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Data source schema
export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'sitemap', 'url', 'file', 'custom'
  source: text("source"), // URL, file path, or custom text
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'error'
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Scanned pages schema
export const scannedPages = pgTable("scanned_pages", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  status: text("status").notNull().default("pending_scan"), // 'pending_scan', 'scanned', 'error'
  errorMessage: text("error_message"),
  scannedAt: timestamp("scanned_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Website = typeof websites.$inferSelect
export type NewWebsite = typeof websites.$inferInsert
export type DataSource = typeof dataSources.$inferSelect
export type NewDataSource = typeof dataSources.$inferInsert
export type ScannedPage = typeof scannedPages.$inferSelect
export type NewScannedPage = typeof scannedPages.$inferInsert
