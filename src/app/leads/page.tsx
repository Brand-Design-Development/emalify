import { LeadsPageClient } from "@emalify/app/leads/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";
import { isAuthenticated } from "@emalify/lib/auth";
import { redirect } from "next/navigation";

export default async function LeadsPage() {
  // Validate session on server
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  await api.lead.getAll.prefetch({});

  return (
    <HydrateClient>
      <LeadsPageClient />;
    </HydrateClient>
  );
}
