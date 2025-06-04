import { createWebsite, getWebsites, getWebsite, deleteWebsite, getWebsiteData } from "./actions/websites"
import { uploadDataSource, getDataSourceStatus, getWebsiteDataSources, deleteDataSource } from "./actions/data-sources"
import { scanWebsite, getScannedPages, deepScanPage, initiateDeepScanAllPending } from "./actions/scanning"

export interface Website {
  id: number
  name: string
  domain: string
  created_at: string
}

export interface DataSource {
  id: number
  type: string
  source: string | null
  status: string
  error: string | null
}

export interface ScannedPage {
  id: number
  url: string
  title: string | null
  status: string
  error_message: string | null
  scanned_at: string | null
}

export const apiClient = {
  // Website methods
  async createWebsite(name: string, domain: string) {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("domain", domain)
    return await createWebsite(formData)
  },

  async getWebsites(): Promise<Website[]> {
    return await getWebsites()
  },

  async getWebsite(id: number): Promise<Website> {
    return await getWebsite(id)
  },

  async deleteWebsite(id: number) {
    return await deleteWebsite(id)
  },

  async getWebsiteData(id: number) {
    return await getWebsiteData(id)
  },

  // Data source methods
  async uploadDataSource(websiteId: number, type: string, source?: string, file?: File) {
    return await uploadDataSource(websiteId, type, source, file)
  },

  async getDataSourceStatus(id: number) {
    return await getDataSourceStatus(id)
  },

  async getWebsiteDataSources(websiteId: number): Promise<DataSource[]> {
    return await getWebsiteDataSources(websiteId)
  },

  async deleteDataSource(id: number) {
    return await deleteDataSource(id)
  },

  // Scanning methods
  async scanWebsite(websiteId: number) {
    return await scanWebsite(websiteId)
  },

  async getScannedPages(websiteId: number): Promise<ScannedPage[]> {
    return await getScannedPages(websiteId)
  },

  async deepScanPage(pageId: number, url: string, websiteId: number) {
    return await deepScanPage(pageId, url, websiteId)
  },

  async initiateDeepScanAllPending(websiteId: number, pendingPages: { id: number; url: string }[]) {
    return await initiateDeepScanAllPending(websiteId, pendingPages)
  },
}
