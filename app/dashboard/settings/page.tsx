import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Settings" description="Manage your account and application settings" />
      <SettingsForm />
    </div>
  )
}
