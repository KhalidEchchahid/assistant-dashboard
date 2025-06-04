import { auth } from "@/auth"
import { getWebsite } from "@/lib/actions/websites"
import { WebsiteTabs } from "@/components/website-tabs"
import { WebsiteScanner } from "@/components/website-scanner"

interface ScanPageProps {
  params: {
    id: string
  }
}

export default async function ScanPage({ params }: ScanPageProps) {
  const session = await auth()

  if (!session) {
    return <div>Unauthorized</div>
  }

  try {
    const website = await getWebsite(Number.parseInt(params.id))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{website.name}</h1>
            <p className="text-muted-foreground">{website.domain}</p>
          </div>
        </div>

        <WebsiteTabs id={params.id} />

        <WebsiteScanner websiteId={params.id} />
      </div>
    )
  } catch (error) {
    return <div>Error loading website: {error instanceof Error ? error.message : "Unknown error"}</div>
  }
}
