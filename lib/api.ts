const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface User {
  id: number
  email: string
  provider: string
  is_admin: boolean
}

export interface AuthResponse {
  authenticated: boolean
  user?: User
}

export interface Website {
  id: number
  name: string
  domain: string
  created_at: string
}

export interface DataSource {
  id: number
  type: string
  source: string
  status: string
  error?: string
  created_at: string
}

export interface ScannedPage {
  id: number
  url: string
  title: string | null
  status: string
  error_message: string | null
  scanned_at: string | null
}

export interface WebsiteData {
  website_id: number
  domain: string
  storage_exists: boolean
  files_found: string[]
  has_vector_store: boolean
  has_docstore: boolean
  has_metadata: boolean
  summary: any
  data_sources_count: number
  processed: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      credentials: "include", // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Log the request for debugging
    console.log(`Making request to: ${url}`)
    console.log("Request config:", {
      method: config.method || "GET",
      credentials: config.credentials,
      headers: config.headers,
    })

    const response = await fetch(url, config)

    // Log response details
    console.log(`Response status: ${response.status}`)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error ${response.status}:`, errorText)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async getAuthStatus(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/status")
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/logout")
  }

  // Websites
  async getWebsites(): Promise<Website[]> {
    return this.request<Website[]>("/websites/")
  }

  async createWebsite(name: string, domain: string): Promise<Website> {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("domain", domain)

    // Log FormData contents
    console.log("FormData contents:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    // Don't set Content-Type header - let browser set it for FormData
    return this.request<Website>("/websites/", {
      method: "POST",
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    })
  }

  async deleteWebsite(websiteId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/websites/${websiteId}`, {
      method: "DELETE",
    })
  }

  async getWebsiteData(websiteId: number): Promise<WebsiteData> {
    return this.request<WebsiteData>(`/websites/${websiteId}/data`)
  }

  // Website Scanning
  async scanWebsite(websiteId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/websites/${websiteId}/scan`, {
      method: "POST",
    })
  }

  async getScannedPages(websiteId: number): Promise<ScannedPage[]> {
    return this.request<ScannedPage[]>(`/websites/${websiteId}/scanned-pages`)
  }

  // Data Sources
  async getDataSources(websiteId: number): Promise<DataSource[]> {
    return this.request<DataSource[]>(`/websites/${websiteId}/sources`)
  }



  async uploadDataSource(
    websiteId: number,
    type: string,
    source?: string,
    file?: File,
  ): Promise<{ id: number; status: string }> {
    const formData = new FormData()
    formData.append("website_id", websiteId.toString())
    formData.append("type", type)

    if (source) {
      formData.append("source", source)
    }

    if (file) {
      formData.append("file", file)
    }

    return this.request<{ id: number; status: string }>("/data/upload/", {
      method: "POST",
      headers: {},
      body: formData,
    })
  }

  async deleteDataSource(dataSourceId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/data/source/${dataSourceId}`, {
      method: "DELETE",
    })
  }

  async getDataSourceStatus(dataSourceId: number): Promise<{
    id: number
    status: string
    error?: string
  }> {
    return this.request(`/data/status/${dataSourceId}`)
  }
}

export const apiClient = new ApiClient()
