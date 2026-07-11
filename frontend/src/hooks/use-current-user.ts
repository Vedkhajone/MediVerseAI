import type { Session, User } from "@supabase/supabase-js";
import type { AppRole } from "@/lib/roles";

export type CurrentUser = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  fullName: string | null;
  email: string | null;
  loading: boolean;
};

export function useCurrentUser(): CurrentUser {
  // Auth temporarily bypassed — return a dummy patient so the app opens
  // straight into the patient dashboard.
  const dummyUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "demo.patient@mediverse.ai",
  } as unknown as User;
  return {
    user: dummyUser,
    session: { user: dummyUser } as unknown as Session,
    role: "patient" as AppRole,
    fullName: "Demo Patient",
    email: "demo.patient@mediverse.ai",
    loading: false,
  };
}