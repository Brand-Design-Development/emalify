import { AdminsPageClient } from "@emalify/app/admins/page-client";
import { api, HydrateClient } from "@emalify/trpc/server";
import { isAuthenticated } from "@emalify/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  await api.admin.getAll.prefetch();

  return (
    <HydrateClient>
      <AdminsPageClient />
    </HydrateClient>
  );
}
