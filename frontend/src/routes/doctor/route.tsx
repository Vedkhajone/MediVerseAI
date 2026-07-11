import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  CalendarDays,
  ClipboardList,
  LineChart,
  Settings,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/doctor", icon: LayoutDashboard },
  { label: "Patients", to: "/doctor/patients", icon: Users },
  { label: "Reports", to: "/doctor/reports", icon: FileText },
  { label: "Predictions", to: "/doctor/predictions", icon: Activity },
  { label: "Appointments", to: "/doctor/appointments", icon: CalendarDays },
  { label: "Prescriptions", to: "/doctor/prescriptions", icon: ClipboardList },
  { label: "Analytics", to: "/doctor/analytics", icon: LineChart },
  { label: "Settings", to: "/doctor/settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/doctor": "Doctor Dashboard",
  "/doctor/patients": "Patients",
  "/doctor/reports": "Reports",
  "/doctor/predictions": "Predictions",
  "/doctor/appointments": "Appointments",
  "/doctor/prescriptions": "Prescriptions",
  "/doctor/analytics": "Analytics",
  "/doctor/settings": "Settings",
};

export const Route = createFileRoute("/doctor")({ component: DoctorLayout });

function DoctorLayout() {
  const router = useRouter();
  const title = TITLES[router.state.location.pathname] ?? "Doctor";
  return (
    <RoleGuard allow={["doctor", "admin"]}>
      {(ctx) => (
        <AppShell items={NAV} roleLabel="Doctor" userName={ctx.fullName} email={ctx.email} title={title}>
          <Outlet />
        </AppShell>
      )}
    </RoleGuard>
  );
}