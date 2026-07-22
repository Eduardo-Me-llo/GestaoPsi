import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Usa getSession() (lê do localStorage) em vez de getUser() (chamada de rede).
    // Isso garante que o redirect pós-OAuth funcione mesmo antes de getUser()
    // responder, pois a sessão já foi gravada no localStorage pela rota /auth/callback.
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.session.user };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
