import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCards } from "@/components/dashboard-cards"
import { WebsitesList } from "@/components/websites-list"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Overview of your AI assistant and websites" />
      <DashboardCards />
      <WebsitesList />
    </div>
  )
}
