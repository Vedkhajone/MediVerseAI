import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Activity,
  Brain,
  CalendarDays,
  Pill,
  LineChart,
  Sparkles,
  Settings,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/patient", icon: LayoutDashboard },
  { label: "Medical Records", to: "/patient/records", icon: FileText },
  { label: "Predictions", to: "/patient/predictions", icon: Activity },
  { label: "Brain Tumor Analysis", to: "/patient/brain", icon: Brain },
  { label: "Appointments", to: "/patient/appointments", icon: CalendarDays },
  { label: "Medicine Reminders", to: "/patient/medications", icon: Pill },
  { label: "Analytics", to: "/patient/analytics", icon: LineChart },
  { label: "AI Assistant", to: "/patient/assistant", icon: Sparkles },
  { label: "Settings", to: "/patient/settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/patient": "Patient Dashboard",
  "/patient/records": "Medical Records",
  "/patient/predictions": "Disease Predictions",
  "/patient/brain": "Brain Tumor Analysis",
  "/patient/appointments": "Appointments",
  "/patient/medications": "Medicine Reminders",
  "/patient/analytics": "Health Analytics",
  "/patient/assistant": "AI Health Assistant",
  "/patient/settings": "Settings",
};

export const Route = createFileRoute("/patient")({
  component: PatientLayout,
});

function PatientLayout() {
  const router = useRouter();
  const title = TITLES[router.state.location.pathname] ?? "Patient";
  return (
    <RoleGuard allow={["patient", "admin"]}>
      {(ctx) => (
        <AppShell items={NAV} roleLabel="Patient" userName={ctx.fullName} email={ctx.email} title={title}>
          <Outlet />
        </AppShell>
      )}
    </RoleGuard>
  );
}