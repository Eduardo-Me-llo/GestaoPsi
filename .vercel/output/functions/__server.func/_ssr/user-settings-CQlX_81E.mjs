import { s as supabase } from "./client-DJK_yZo7.mjs";
const DEFAULT_AGENDA = {
  start_hour: 8,
  end_hour: 20,
  session_duration: 50,
  hidden_days: [0]
  // hide Sunday by default
};
const DEFAULT_NOTIFICATIONS = {
  session_reminder: true,
  daily_agenda: true,
  payment_alerts: true,
  email_notifications: false
};
function parsePrefs(address) {
  if (!address || typeof address !== "object") return {};
  return {
    bio: address.bio,
    agenda: address.agenda,
    notifications: address.notifications
  };
}
async function loadPrefs() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return {};
  const { data } = await supabase.from("profiles").select("address").eq("id", u.user.id).maybeSingle();
  return parsePrefs(data?.address);
}
function getAvatarPath(address) {
  if (!address || typeof address !== "object") return null;
  return address.avatar_path ?? null;
}
async function getSignedAvatarUrl(path) {
  if (!path) return null;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
export {
  DEFAULT_AGENDA as D,
  getSignedAvatarUrl as a,
  DEFAULT_NOTIFICATIONS as b,
  getAvatarPath as g,
  loadPrefs as l
};
