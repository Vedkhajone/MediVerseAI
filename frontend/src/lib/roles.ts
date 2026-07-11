import type { Database } from "@/integrations/supabase/types";

export type AppRole = "patient" | "doctor" | "admin";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export const ROLE_HOME: Record<AppRole, string> = {
  patient: "/patient",
  doctor: "/doctor",
  admin: "/admin",
};