import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  LineChart,
  Cpu,
  ScrollText,
  Settings,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Doctors", to: "/admin/doctors", icon: Stethoscope },
  { label: "Clinics", to: "/admin/clinics", icon: Building2 },
  { label: "Analytics", to: "/admin/analytics", icon: LineChart },
  { label: "AI Models", to: "/admin/models", icon: Cpu },
  { label: "Logs", to: "/admin/logs", icon: ScrollText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/admin": "Admin Overview",
  "/admin/users": "Users",
  "/admin/doctors": "Doctors",
  "/admin/clinics": "Clinics",
  "/admin/analytics": "Platform Analytics",
  "/admin/models": "AI Models",
  "/admin/logs": "Audit Logs",
  "/admin/settings": "Settings",
};

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const router = useRouter();
  const title = TITLES[router.state.location.pathname] ?? "Admin";
  return (
    <RoleGuard allow={["admin"]}>
      {(ctx) => (
        <AppShell items={NAV} roleLabel="Admin" userName={ctx.fullName} email={ctx.email} title={title}>
          <Outlet />
        </AppShell>
      )}
    </RoleGuard>
  );
}