import { supabase } from "@/integrations/supabase/client";

export type AuditAction =
  | "login"
  | "logout"
  | "insert"
  | "update"
  | "delete"
  | "block"
  | "unblock"
  | "activate"
  | "deactivate"
  | "role_change"
  | "password_reset"
  | "settings_update";

type LogArgs = {
  action: AuditAction;
  entity?: string;
  entityId?: string;
  details?: Record<string, unknown>;
};

let cachedIp: string | null | undefined;

/**
 * Busca o IP público do cliente (best-effort). O resultado é cacheado
 * na sessão. Falhas são silenciosas — auditoria nunca deve quebrar o fluxo.
 */
async function getClientIp(): Promise<string | null> {
  if (cachedIp !== undefined) return cachedIp ?? null;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = (await res.json()) as { ip?: string };
    cachedIp = json.ip ?? null;
  } catch {
    cachedIp = null;
  }
  return cachedIp ?? null;
}

/**
 * Registra uma ação na tabela de auditoria.
 * Ações de dados (insert/update/delete) nas tabelas de negócio já são
 * capturadas por triggers no banco; use este helper para eventos que
 * só o cliente conhece (login, logout, redefinição de senha, etc).
 */
export async function logAudit({ action, entity, entityId, details }: LogArgs): Promise<void> {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const ip = await getClientIp();
    await supabase.from("audit_logs").insert({
      user_id: u.user.id,
      actor_email: u.user.email ?? null,
      action,
      entity: entity ?? null,
      entity_id: entityId ?? null,
      details: details ?? null,
      ip_address: ip,
    });
  } catch {
    // Silencioso por design.
  }
}
