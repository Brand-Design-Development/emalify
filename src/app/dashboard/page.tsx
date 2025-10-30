import { DashboardPageClient } from "@emalify/app/dashboard/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";

export default async function DashboardPage() {
  await api.lead.getStats.prefetch();
  return (
    <HydrateClient>
      <DashboardPageClient />
    </HydrateClient>
  );
}
