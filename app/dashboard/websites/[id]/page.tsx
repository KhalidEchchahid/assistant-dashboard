import { auth } from "@/auth"
import { getWebsite, getWebsiteData } from "@/lib/actions/websites"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Database, Activity, Calendar } from "lucide-react"
import { WebsiteTabs } from "@/components/website-tabs"

interface WebsitePageProps {
  params: {
    id: string
  }
}

export default async function WebsitePage({ params }: WebsitePageProps) {
  const session = await auth()

  if (!session) {
    return <div>Unauthorized</div>
  }

  try {
    const website = await getWebsite(Number.parseInt(params.id))
    const websiteData = await getWebsiteData(Number.parseInt(params.id))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{website.name}</h1>
            <p className="text-muted-foreground">{website.domain}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        <WebsiteTabs id={params.id} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">AI assistant is running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{websiteData.data_sources_count}</div>
              <p className="text-xs text-muted-foreground">sources configured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{websiteData.processed ? "Complete" : "Pending"}</div>
              <p className="text-xs text-muted-foreground">data processing status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(website.created_at).toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">website added</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Website Information</CardTitle>
              <CardDescription>Basic details about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm">{website.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Domain</span>
                <span className="text-sm">{website.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm">{new Date(website.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing</CardTitle>
              <CardDescription>Status of your website's data processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Vector Store</span>
                <Badge variant={websiteData.has_vector_store ? "default" : "secondary"}>
                  {websiteData.has_vector_store ? "Ready" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Document Store</span>
                <Badge variant={websiteData.has_docstore ? "default" : "secondary"}>
                  {websiteData.has_docstore ? "Ready" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Metadata</span>
                <Badge variant={websiteData.has_metadata ? "default" : "secondary"}>
                  {websiteData.has_metadata ? "Ready" : "Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    return <div>Error loading website: {error instanceof Error ? error.message : "Unknown error"}</div>
  }
}
