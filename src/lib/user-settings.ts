import { supabase } from "@/integrations/supabase/client";

export type AgendaSettings = {
  start_hour: number; // 0-23
  end_hour: number; // 1-24
  session_duration: number; // minutes
  hidden_days: number[]; // 0=dom..6=sab
};

export type NotificationSettings = {
  session_reminder: boolean;
  daily_agenda: boolean;
  payment_alerts: boolean;
  email_notifications: boolean;
};

export type UserPrefs = {
  bio?: string;
  agenda?: AgendaSettings;
  notifications?: NotificationSettings;
};

export const DEFAULT_AGENDA: AgendaSettings = {
  start_hour: 8,
  end_hour: 20,
  session_duration: 50,
  hidden_days: [0], // hide Sunday by default
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  session_reminder: true,
  daily_agenda: true,
  payment_alerts: true,
  email_notifications: false,
};

export function parsePrefs(address: any): UserPrefs {
  if (!address || typeof address !== "object") return {};
  return {
    bio: address.bio,
    agenda: address.agenda,
    notifications: address.notifications,
  };
}

export async function loadPrefs(): Promise<UserPrefs> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return {};
  const { data } = await supabase.from("profiles").select("address").eq("id", u.user.id).maybeSingle();
  return parsePrefs(data?.address);
}

export function getAvatarPath(address: any): string | null {
  if (!address || typeof address !== "object") return null;
  return address.avatar_path ?? null;
}

export async function getSignedAvatarUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
