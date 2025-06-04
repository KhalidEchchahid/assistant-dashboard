"use server";

import { auth } from "@/auth";
import { db, websites, scannedPages } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface ExtractedRoutesResponse {
  url: string;
  discovered_links: string[];
  link_count: number;
  status_counts: Record<string, number>;
  status_details: Record<
    string,
    {
      status_code: number | null;
      status_group: string;
      error?: string;
    }
  >;
  error?: string | null;
}

interface DeepScanPageRequest {
  url: string;
  website_id: string;
  page_id: string;
}

interface DeepScanPageResponse {
  message: string;
  page_id: string;
  website_id: string;
  scanned_url: string;
  status: string;
  rag_documents_summary?: Array<{
    text: string;
    metadata: Record<string, any>;
  }>;
  rag_document_count?: number;
  raw_data_path?: string;
  rag_index_path?: string;
  error_detail?: string;
}

interface PendingPageInfo {
  page_id: string;
  url: string;
}

interface DeepScanAllRequest {
  website_id: string;
  pending_pages: PendingPageInfo[];
}

// Define the base URL of your Python API service
const EXTRACTOR_API_BASE_URL =
  process.env.EXTRACTOR_API_URL || "http://localhost:8000";

// Helper function to test API connectivity
async function testApiConnection() {
  try {
    console.log(`Testing API connection to: ${EXTRACTOR_API_BASE_URL}/health`);

    const response = await fetch(`${EXTRACTOR_API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Health check response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API health check failed: ${response.status} ${response.statusText} - ${errorText}`
      );
      return false;
    }

    const data = await response.json();
    console.log("API health check successful:", data);
    return true;
  } catch (error) {
    console.error("API connection failed:", error);
    return false;
  }
}

// Helper function to list available routes (for debugging)
async function listApiRoutes() {
  try {
    const response = await fetch(`${EXTRACTOR_API_BASE_URL}/debug/routes`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Available API routes:", data.routes);
      return data.routes;
    }
  } catch (error) {
    console.log(
      "Could not fetch debug routes (this is normal if endpoint doesn't exist)"
    );
  }
  return null;
}

export async function scanWebsite(websiteId: number) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    console.log(`Starting website scan for website ID: ${websiteId}`);

    // Test API connection first
    const apiConnected = await testApiConnection();
    if (!apiConnected) {
      // Try to list routes for debugging
      await listApiRoutes();
      throw new Error(
        "Cannot connect to the extraction API service. Please ensure the Python API is running on http://localhost:8000"
      );
    }

    // Verify website ownership
    const websiteResults = await db
      .select()
      .from(websites)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, Number.parseInt(session.user.dbId))
        )
      )
      .limit(1);

    const website = websiteResults[0];
    if (!website) {
      throw new Error("Website not found or not owned by user");
    }

    const websiteUrlToScan = `https://${website.domain}`;
    console.log(`Scanning website: ${websiteUrlToScan}`);

    // Call the API from the agent service that scans the website
    let discoveredPagesFromApi: { url: string; title: string }[] = [];

    try {
      const apiEndpoint = `${EXTRACTOR_API_BASE_URL}/extract-website-routes/`;
      console.log(`Calling API endpoint: ${apiEndpoint}`);
      console.log(`Request body:`, { url: websiteUrlToScan });

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: websiteUrlToScan }),
      });

      console.log(`API response status: ${response.status}`);
      console.log(
        `API response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `API call failed with status ${response.status}: ${errorBody}`
        );

        if (response.status === 404) {
          throw new Error(
            `API endpoint not found. Please check that your Python API is running and the /extract-website-routes/ endpoint is available. Response: ${errorBody}`
          );
        }

        throw new Error(
          `Failed to fetch routes from extractor API: ${response.statusText} - ${errorBody}`
        );
      }

      const data: ExtractedRoutesResponse = await response.json();
      console.log(`API response data:`, data);

      if (data.error) {
        console.error(`Extractor API returned an error: ${data.error}`);
        throw new Error(`Extractor API error: ${data.error}`);
      }

      if (data.discovered_links && data.discovered_links.length > 0) {
        discoveredPagesFromApi = data.discovered_links.map((link) => ({
          url: link,
          title: `Page: ${new URL(link).pathname || "/"}`,
        }));
        console.log(`Discovered ${discoveredPagesFromApi.length} pages`);
      } else {
        console.warn(`No links discovered by the API for ${websiteUrlToScan}`);
      }
    } catch (apiError: any) {
      console.error("Error calling extractor API:", apiError);
      throw new Error(
        `Failed to communicate with website extractor service: ${apiError.message}`
      );
    }

    // Insert discovered pages
    if (discoveredPagesFromApi.length === 0) {
      console.log(`No pages to insert for website ID ${websiteId}.`);
    }

    for (const pageInfo of discoveredPagesFromApi) {
      // Check if page already exists
      const existingPageResults = await db
        .select()
        .from(scannedPages)
        .where(
          and(
            eq(scannedPages.websiteId, websiteId),
            eq(scannedPages.url, pageInfo.url)
          )
        )
        .limit(1);

      if (!existingPageResults[0]) {
        await db.insert(scannedPages).values({
          websiteId,
          url: pageInfo.url,
          title: pageInfo.title,
          status: "pending_scan",
        });
        console.log(`Inserted page: ${pageInfo.url} for website ${websiteId}`);
      } else {
        console.log(
          `Page already exists: ${pageInfo.url} for website ${websiteId}`
        );
      }
    }

    revalidatePath(`/dashboard/websites/${websiteId}/scan`);
    return {
      message: `Scan initiated for ${website.domain}. ${discoveredPagesFromApi.length} pages/links identified for cataloging.`,
    };
  } catch (error: any) {
    console.error("Error scanning website:", error);
    throw new Error(error.message || "Failed to scan website");
  }
}

export async function getScannedPages(websiteId: number) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify website ownership
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
      throw new Error("Website not found or not owned by user");
    }

    const pages = await db
      .select()
      .from(scannedPages)
      .where(eq(scannedPages.websiteId, websiteId))
      .orderBy(scannedPages.url);

    return pages.map((page) => ({
      id: page.id,
      url: page.url,
      title: page.title,
      status: page.status,
      error_message: page.errorMessage,
      scanned_at: page.scannedAt?.toISOString() || null,
    }));
  } catch (error) {
    console.error("Error fetching scanned pages:", error);
    throw new Error("Failed to fetch scanned pages");
  }
}

export async function updatePageScanStatus(
  pageId: number,
  status: string,
  errorMessage?: string
) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    const updateData: any = {
      status,
      scannedAt: new Date(),
    };

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await db
      .update(scannedPages)
      .set(updateData)
      .where(eq(scannedPages.id, pageId));

    return { success: true };
  } catch (error) {
    console.error("Error updating page scan status:", error);
    throw new Error("Failed to update page scan status");
  }
}

export async function deepScanPage(
  pageId: number,
  url: string,
  websiteId: number
) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify website ownership
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
      throw new Error("Website not found or not owned by user");
    }

    // Update page status to processing
    await updatePageScanStatus(pageId, "processing");

    // Call the deep scan API
    const response = await fetch(`${EXTRACTOR_API_BASE_URL}/deep-scan-page/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        website_id: websiteId.toString(),
        page_id: pageId.toString(),
      } as DeepScanPageRequest),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Deep scan API call failed with status ${response.status}: ${errorBody}`
      );

      // Update page status to error
      await updatePageScanStatus(
        pageId,
        "error",
        `API error: ${response.statusText}`
      );

      throw new Error(`Failed to deep scan page: ${response.statusText}`);
    }

    const data: DeepScanPageResponse = await response.json();

    // Update page status based on API response
    if (data.status === "scanned") {
      await updatePageScanStatus(pageId, "scanned");
    } else {
      await updatePageScanStatus(
        pageId,
        "error",
        data.error_detail || "Unknown error during deep scan"
      );
    }

    revalidatePath(`/dashboard/websites/${websiteId}/scan`);
    return data;
  } catch (error: any) {
    console.error("Error deep scanning page:", error);
    throw new Error(error.message || "Failed to deep scan page");
  }
}

export async function initiateDeepScanAllPending(
  websiteId: number,
  pendingPages: { id: number; url: string }[]
) {
  const session = await auth();
  if (!session?.user?.dbId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify website ownership
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
      throw new Error("Website not found or not owned by user");
    }

    if (pendingPages.length === 0) {
      throw new Error("No pending pages provided");
    }

    // Format the pending pages for the API
    const formattedPendingPages: PendingPageInfo[] = pendingPages.map(
      (page) => ({
        page_id: page.id.toString(),
        url: page.url,
      })
    );

    // Call the deep scan all API
    const response = await fetch(
      `${EXTRACTOR_API_BASE_URL}/initiate-deep-scan-all-pending/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website_id: websiteId.toString(),
          pending_pages: formattedPendingPages,
        } as DeepScanAllRequest),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Deep scan all API call failed with status ${response.status}: ${errorBody}`
      );
      throw new Error(
        `Failed to initiate deep scan for all pages: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Update all pages to processing status
    for (const page of pendingPages) {
      await updatePageScanStatus(page.id, "processing");
    }

    revalidatePath(`/dashboard/websites/${websiteId}/scan`);
    return {
      message: data.message,
      website_id: data.website_id,
      initiated_page_ids: data.initiated_page_ids,
    };
  } catch (error: any) {
    console.error("Error initiating deep scan for all pages:", error);
    throw new Error(
      error.message || "Failed to initiate deep scan for all pages"
    );
  }
}
