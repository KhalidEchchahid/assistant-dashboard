"use server"

import { auth } from "@/auth"
import { db, websites, dataSources } from "@/lib/db"
import { eq, and, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function uploadDataSource(websiteId: number, type: string, source?: string, file?: File) {
  const session = await auth()
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized")
  }

  try {
    // Verify website ownership
    const website = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, Number.parseInt(session.user.dbId))))
      .limit(1)

    if (!website[0]) {
      throw new Error("Website not found or not owned by user")
    }

    let finalSource = source

    // Handle file upload
    if (type === "file" && file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create storage directory if it doesn't exist
      const storageDir = join(process.cwd(), "storage")
      await mkdir(storageDir, { recursive: true })

      // Save file
      const fileName = `${websiteId}_${file.name}`
      const filePath = join(storageDir, fileName)
      await writeFile(filePath, buffer)
      finalSource = filePath
    }

    // Create data source record
    const result = await db
      .insert(dataSources)
      .values({
        websiteId,
        type,
        source: finalSource,
        status: "pending",
      })
      .returning()

    // TODO: Add background task processing here
    // processDataSource(result[0].id)

    revalidatePath(`/dashboard/websites/${websiteId}/data-sources`)
    return {
      id: result[0].id,
      status: result[0].status,
    }
  } catch (error) {
    console.error("Error uploading data source:", error)
    throw new Error("Failed to upload data source")
  }
}

export async function getDataSourceStatus(dataSourceId: number) {
  const session = await auth()
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized")
  }

  try {
    const dataSource = await db
      .select({
        id: dataSources.id,
        status: dataSources.status,
        error: dataSources.error,
        websiteId: dataSources.websiteId,
        userId: websites.userId,
      })
      .from(dataSources)
      .innerJoin(websites, eq(dataSources.websiteId, websites.id))
      .where(and(eq(dataSources.id, dataSourceId), eq(websites.userId, Number.parseInt(session.user.dbId))))
      .limit(1)

    if (!dataSource[0]) {
      throw new Error("Data source not found")
    }

    return {
      id: dataSource[0].id,
      status: dataSource[0].status,
      error: dataSource[0].error,
    }
  } catch (error) {
    console.error("Error fetching data source status:", error)
    throw new Error("Failed to fetch data source status")
  }
}

export async function getWebsiteDataSources(websiteId: number) {
  const session = await auth()
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized")
  }

  try {
    // Verify website ownership
    const website = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, Number.parseInt(session.user.dbId))))
      .limit(1)

    if (!website[0]) {
      throw new Error("Website not found or not owned by user")
    }

    const sources = await db
      .select()
      .from(dataSources)
      .where(eq(dataSources.websiteId, websiteId))
      .orderBy(desc(dataSources.createdAt))

    return sources.map((source) => ({
      id: source.id,
      type: source.type,
      source: source.source,
      status: source.status,
      error: source.error,
    }))
  } catch (error) {
    console.error("Error fetching data sources:", error)
    throw new Error("Failed to fetch data sources")
  }
}

export async function deleteDataSource(dataSourceId: number) {
  const session = await auth()
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await db
      .delete(dataSources)
      .where(eq(dataSources.id, dataSourceId))
      .returning({ websiteId: dataSources.websiteId })

    if (!result[0]) {
      throw new Error("Data source not found")
    }

    revalidatePath(`/dashboard/websites/${result[0].websiteId}/data-sources`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting data source:", error)
    throw new Error("Failed to delete data source")
  }
}
