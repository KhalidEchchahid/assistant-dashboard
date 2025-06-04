import { WebsiteHeader } from "@/components/website-header"
import { WebsiteTabs } from "@/components/website-tabs"
import { DataSourcesList } from "@/components/data-sources-list"
import { AddDataSourceButton } from "@/components/add-data-source-button"

interface DataSourcesPageProps {
  params: {
    id: string
  }
}

export default function DataSourcesPage({ params }: DataSourcesPageProps) {
  const { id } = params

  return (
    <div className="space-y-6">
      <WebsiteHeader id={id} />
      <WebsiteTabs id={id} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Sources</h2>
        <AddDataSourceButton websiteId={id} />
      </div>
      <DataSourcesList websiteId={id} />
    </div>
  )
}
