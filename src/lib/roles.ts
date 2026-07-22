import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type AppRole = "admin" | "psicologo";

/**
 * Retorna os papéis do usuário autenticado atual.
 * A leitura respeita a RLS de user_roles (o usuário só enxerga os próprios papéis,
 * exceto o admin, que enxerga todos).
 */
export async function getMyRoles(): Promise<AppRole[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", u.user.id);
  if (error) return [];
  return (data ?? []).map((r: { role: AppRole }) => r.role);
}

/**
 * Verifica no banco (fonte da verdade) se o usuário atual é admin.
 * Usa a função is_admin() via RPC — a mesma que protege a RLS,
 * garantindo consistência entre frontend e backend.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || typeof data !== "boolean") {
    // Fallback: consulta direta em user_roles
    const roles = await getMyRoles();
    return roles.includes("admin");
  }
  return data;
}

/** Hook React para saber se o usuário atual é administrador. */
export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: checkIsAdmin,
    staleTime: 5 * 60 * 1000,
  });
}

/** Hook React que retorna os papéis do usuário atual. */
export function useMyRoles() {
  return useQuery({
    queryKey: ["my-roles"],
    queryFn: getMyRoles,
    staleTime: 5 * 60 * 1000,
  });
}
