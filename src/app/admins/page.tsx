import { AdminsPageClient } from "@emalify/app/admins/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";

export default async function AdminsPage() {
  await api.admin.getAll.prefetch();

  return (
    <HydrateClient>
      <AdminsPageClient />
    </HydrateClient>
  );
}
