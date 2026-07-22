import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/roles";
import { AdminShell } from "@/components/layout/AdminShell";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    // 1. Precisa estar autenticado
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({ to: "/auth" });
    }

    // 2. Precisa ser admin (verificação no banco via is_admin()).
    //    A RLS do backend também bloqueia acesso a dados de outros usuários
    //    para quem não é admin — dupla camada de segurança.
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
