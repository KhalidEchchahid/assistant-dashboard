import type React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Layout/sidebar";
import { DashboardHeader } from "@/components/Layout/header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()
  console.log("Session in Dashboard Layout:", session);
  if (!session) {
    redirect("/auth/signin")
  }
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar user={session?.user} />
          <SidebarInset className="flex-1 flex flex-col min-w-0">
            <DashboardHeader />
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
          </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
