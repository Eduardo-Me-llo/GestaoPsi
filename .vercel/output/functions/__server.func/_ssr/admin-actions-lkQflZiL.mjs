import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CB3iGyyA.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BB41Zovk.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const adminCreatePsychologist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.email || !data?.password || data.password.length < 6) {
    throw new Error("E-mail e senha (mín. 6 caracteres) são obrigatórios.");
  }
  return data;
}).handler(createSsrRpc("526722240008cc99e8a1dd6761c7ffbfad1ae2f2e1bfd6fa34f9c6e70feba48b"));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.userId) throw new Error("userId é obrigatório.");
  return data;
}).handler(createSsrRpc("94cf72aa92a2baa3dc6328b2369e81aa994d25b2ce7dea8f80e6baf8f024d4d0"));
const adminSetPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((data) => {
  if (!data?.userId || !data?.password || data.password.length < 6) {
    throw new Error("Senha deve ter ao menos 6 caracteres.");
  }
  return data;
}).handler(createSsrRpc("818d112ffd204d16765582650393988d28f70ed6b7361fb331219be531fd2639"));
export {
  adminCreatePsychologist as a,
  adminSetPassword as b,
  adminDeleteUser as c
};
