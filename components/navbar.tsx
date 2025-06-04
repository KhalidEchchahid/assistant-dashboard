import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "@/components/search"
import { ModeToggle } from "@/components/mode-toggle"
import { Notifications } from "@/components/notifications"

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-full">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 w-full">
        <Search />
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Notifications />
      </div>
    </header>
  )
}
