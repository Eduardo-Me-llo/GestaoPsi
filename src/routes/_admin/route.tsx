import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/roles";
import { AdminShell } from "@/components/layout/AdminShell";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return { user: null };
    }

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({ to: "/auth" });
    }

    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      throw redirect({ to: "/dashboard" });
    }

    return { user: data.session.user };
  },
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
