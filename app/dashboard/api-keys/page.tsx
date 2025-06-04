import { DashboardHeader } from "@/components/dashboard-header"
import { ApiKeysList } from "@/components/api-keys-list"

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="API Keys" description="Manage your API keys for accessing the AI assistant" />
      <ApiKeysList />
    </div>
  )
}
