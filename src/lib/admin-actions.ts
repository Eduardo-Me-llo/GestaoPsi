import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Server functions para operações administrativas privilegiadas que exigem
 * a chave service_role (criar/excluir usuários da camada de Auth, definir
 * senha). Rodam SOMENTE no servidor.
 *
 * Segurança em duas camadas:
 *  1. requireSupabaseAuth valida o Bearer token do chamador.
 *  2. assertAdmin() confirma, no banco (is_admin), que o chamador é admin.
 *
 * Requer SUPABASE_SERVICE_ROLE_KEY no ambiente do servidor. Sem ela,
 * as funções lançam um erro claro e a UI degrada graciosamente.
 */

async function assertAdmin(supabase: {
  rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>;
}) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) {
    throw new Error("Acesso negado: requer perfil de administrador.");
  }
}

// ── Criar novo psicólogo (cria usuário no Auth já confirmado) ──────────────
export const adminCreatePsychologist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { email: string; password: string; fullName: string }) => {
    if (!data?.email || !data?.password || data.password.length < 6) {
      throw new Error("E-mail e senha (mín. 6 caracteres) são obrigatórios.");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error) throw new Error(error.message);
    return { id: created.user?.id };
  });

// ── Excluir usuário (remove do Auth; dados em cascata via FK) ──────────────
export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { userId: string }) => {
    if (!data?.userId) throw new Error("userId é obrigatório.");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    if (data.userId === context.userId) {
      throw new Error("Você não pode excluir a própria conta.");
    }
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Definir nova senha para um usuário ─────────────────────────────────────
export const adminSetPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { userId: string; password: string }) => {
    if (!data?.userId || !data?.password || data.password.length < 6) {
      throw new Error("Senha deve ter ao menos 6 caracteres.");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      data.userId,
      { password: data.password },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
