import { s as supabase } from "./client-DJK_yZo7.mjs";
let cachedIp;
async function getClientIp() {
  if (cachedIp !== void 0) return cachedIp ?? null;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = await res.json();
    cachedIp = json.ip ?? null;
  } catch {
    cachedIp = null;
  }
  return cachedIp ?? null;
}
async function logAudit({ action, entity, entityId, details }) {
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
      ip_address: ip
    });
  } catch {
  }
}
export {
  logAudit as l
};
