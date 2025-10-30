import { LeadsPageClient } from "@emalify/app/leads/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";

export default async function LeadsPage() {
  await api.lead.getAll.prefetch({});

  return (
    <HydrateClient>
      <LeadsPageClient />;
    </HydrateClient>
  );
}
