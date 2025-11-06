import { DashboardPageClient } from "@emalify/app/dashboard/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";
import { isAuthenticated } from "@emalify/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Validate session on server
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  await api.lead.getStats.prefetch();
  return (
    <HydrateClient>
      <DashboardPageClient />
    </HydrateClient>
  );
}
