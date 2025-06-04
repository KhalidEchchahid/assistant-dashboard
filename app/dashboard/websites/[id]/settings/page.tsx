import { WebsiteHeader } from "@/components/website-header"
import { WebsiteTabs } from "@/components/website-tabs"
import { WebsiteSettings } from "@/components/website-settings"

interface SettingsPageProps {
  params: {
    id: string
  }
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { id } = params

  return (
    <div className="space-y-6">
      <WebsiteHeader id={id} />
      <WebsiteTabs id={id} />
      <WebsiteSettings websiteId={id} />
    </div>
  )
}
