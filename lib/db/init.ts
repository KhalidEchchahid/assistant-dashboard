"use server"

import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function setupDatabase() {
  try {
    console.log("Setting up database tables...")

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        provider TEXT NOT NULL,
        provider_user_id TEXT NOT NULL,
        api_key TEXT NOT NULL UNIQUE,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)
    console.log("Users table created/verified")

    // Create websites table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS websites (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)
    console.log("Websites table created/verified")

    // Create data_sources table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS data_sources (
        id SERIAL PRIMARY KEY,
        website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        source TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        error TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)
    console.log("Data sources table created/verified")

    // Create scanned_pages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS scanned_pages (
        id SERIAL PRIMARY KEY,
        website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        title TEXT,
        status TEXT NOT NULL DEFAULT 'pending_scan',
        error_message TEXT,
        scanned_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)
    console.log("Scanned pages table created/verified")

    // Verify tables exist
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'websites', 'data_sources', 'scanned_pages')
    `)

    console.log("Database setup completed successfully")
    console.log(
      "Tables found:",
      tablesResult.rows.map((row) => row.table_name),
    )

    return {
      success: true,
      tables: tablesResult.rows.map((row) => row.table_name),
    }
  } catch (error) {
    console.error("Error setting up database:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function checkDatabaseStatus() {
  try {
    // Check if tables exist
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'websites', 'data_sources', 'scanned_pages')
    `)

    const existingTables = tablesResult.rows.map((row) => row.table_name)
    const requiredTables = ["users", "websites", "data_sources", "scanned_pages"]
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    return {
      success: true,
      existingTables,
      missingTables,
      allTablesExist: missingTables.length === 0,
    }
  } catch (error) {
    console.error("Error checking database status:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
