import { WebsiteHeader } from "@/components/website-header"
import { WebsiteTabs } from "@/components/website-tabs"
import { EmbedCodeSection } from "@/components/embed-code-section"

interface EmbedPageProps {
  params: {
    id: string
  }
}

export default function EmbedPage({ params }: EmbedPageProps) {
  const { id } = params

  return (
    <div className="space-y-6">
      <WebsiteHeader id={id} />
      <WebsiteTabs id={id} />
      <EmbedCodeSection websiteId={id} />
    </div>
  )
}
