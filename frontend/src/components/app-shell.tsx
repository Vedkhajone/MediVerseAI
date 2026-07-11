import { Link, useRouter } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export function AppShell({
  items,
  roleLabel,
  userName,
  email,
  title,
  children,
}: {
  items: NavItem[];
  roleLabel: string;
  userName: string | null;
  email: string | null;
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.invalidate();
    navigate({ to: "/" });
  }

  const currentPath = router.state.location.pathname;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <img src={logo} alt="MediVerse" className="h-7 w-7" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">MediVerse AI</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {roleLabel}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    currentPath === item.to || currentPath.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link to={item.to}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 px-2 pb-2 text-xs">
            <div className="truncate font-medium">{userName ?? "Account"}</div>
            <div className="truncate text-muted-foreground">{email}</div>
            <Button variant="outline" size="sm" onClick={signOut} className="mt-1">
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-sm font-semibold">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}