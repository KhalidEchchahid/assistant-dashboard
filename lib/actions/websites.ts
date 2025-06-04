"use server";

import { auth } from "@/auth";
import { db, websites, dataSources } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createWebsite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const domain = formData.get("domain") as string;

  if (!name || !domain) {
    throw new Error("Name and domain are required");
  }

  try {
    const result = await db
      .insert(websites)
      .values({
        name,
        domain,
        userId: Number.parseInt(session.user.dbId),
      })
      .returning();

    revalidatePath("/dashboard/websites");
    return {
      success: true,
      website: result[0],
    };
  } catch (error) {
    console.error("Error creating website:", error);
    throw new Error("Failed to create website");
  }
}

export async function getWebsites() {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    const userWebsites = await db
      .select()
      .from(websites)
      .where(eq(websites.userId, Number.parseInt(session.user.dbId)))
      .orderBy(desc(websites.createdAt));

    return userWebsites.map((website) => ({
      id: website.id,
      name: website.name,
      domain: website.domain,
      created_at: website.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching websites:", error);
    throw new Error("Failed to fetch websites");
  }
}

export async function getWebsite(websiteId: number) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    const website = await db
      .select()
      .from(websites)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, Number.parseInt(session.user.dbId))
        )
      )
      .limit(1);

    if (!website[0]) {
      throw new Error("Website not found");
    }

    return {
      id: website[0].id,
      name: website[0].name,
      domain: website[0].domain,
      created_at: website[0].createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching website:", error);
    throw new Error("Failed to fetch website");
  }
}

export async function deleteWebsite(websiteId: number) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await db
      .delete(websites)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, Number.parseInt(session.user.dbId))
        )
      )
      .returning();

    if (!result[0]) {
      throw new Error("Website not found");
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting website:", error);
    throw new Error("Failed to delete website");
  }
}

export async function getWebsiteData(websiteId: number) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    const website = await db
      .select()
      .from(websites)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, Number.parseInt(session.user.dbId))
        )
      )
      .limit(1);

    if (!website[0]) {
      throw new Error("Website not found");
    }

    // Get data sources count
    const dataSourcesCount = await db
      .select()
      .from(dataSources)
      .where(eq(dataSources.websiteId, websiteId));

    // For now, return simplified data structure
    // In a real implementation, you'd check actual storage/vector store files
    return {
      website_id: websiteId,
      domain: website[0].domain,
      storage_exists: true,
      files_found: [],
      has_vector_store: false,
      has_docstore: false,
      has_metadata: false,
      summary: null,
      data_sources_count: dataSourcesCount.length,
      processed: false,
    };
  } catch (error) {
    console.error("Error fetching website data:", error);
    throw new Error("Failed to fetch website data");
  }
}
