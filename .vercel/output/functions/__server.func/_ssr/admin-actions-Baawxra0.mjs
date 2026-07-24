import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-CB3iGyyA.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BB41Zovk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
async function assertAdmin(supabase) {
  const {
    data,
    error
  } = await supabase.rpc("is_admin");
  if (error || data !== true) {
    throw new Error("Acesso negado: requer perfil de administrador.");
  }
}
const adminCreatePsychologist_createServerFn_handler = createServerRpc({
  id: "526722240008cc99e8a1dd6761c7ffbfad1ae2f2e1bfd6fa34f9c6e70feba48b",
  name: "adminCreatePsychologist",
  filename: "src/lib/admin-actions.ts"
}, (opts) => adminCreatePsychologist.__executeServer(opts));
const adminCreatePsychologist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.email || !data?.password || data.password.length < 6) {
    throw new Error("E-mail e senha (mín. 6 caracteres) são obrigatórios.");
  }
  return data;
}).handler(adminCreatePsychologist_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase);
  const {
    supabaseAdmin
  } = await import("./client.server-DkcdKqL3.mjs");
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.fullName
    }
  });
  if (error) throw new Error(error.message);
  return {
    id: created.user?.id
  };
});
const adminDeleteUser_createServerFn_handler = createServerRpc({
  id: "94cf72aa92a2baa3dc6328b2369e81aa994d25b2ce7dea8f80e6baf8f024d4d0",
  name: "adminDeleteUser",
  filename: "src/lib/admin-actions.ts"
}, (opts) => adminDeleteUser.__executeServer(opts));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.userId) throw new Error("userId é obrigatório.");
  return data;
}).handler(adminDeleteUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase);
  if (data.userId === context.userId) {
    throw new Error("Você não pode excluir a própria conta.");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-DkcdKqL3.mjs");
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminSetPassword_createServerFn_handler = createServerRpc({
  id: "818d112ffd204d16765582650393988d28f70ed6b7361fb331219be531fd2639",
  name: "adminSetPassword",
  filename: "src/lib/admin-actions.ts"
}, (opts) => adminSetPassword.__executeServer(opts));
const adminSetPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.userId || !data?.password || data.password.length < 6) {
    throw new Error("Senha deve ter ao menos 6 caracteres.");
  }
  return data;
}).handler(adminSetPassword_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase);
  const {
    supabaseAdmin
  } = await import("./client.server-DkcdKqL3.mjs");
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
    password: data.password
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminCreatePsychologist_createServerFn_handler,
  adminDeleteUser_createServerFn_handler,
  adminSetPassword_createServerFn_handler
};
