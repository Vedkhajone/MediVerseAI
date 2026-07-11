import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AppRole } from "@/lib/roles";
import { ROLE_HOME } from "@/lib/roles";

export function RoleGuard({
  allow,
  children,
}: {
  allow: AppRole[];
  children: (ctx: ReturnType<typeof useCurrentUser>) => ReactNode;
}) {
  const navigate = useNavigate();
  const ctx = useCurrentUser();

  useEffect(() => {
    if (ctx.loading) return;
    if (!ctx.user) {
      navigate({ to: "/auth" });
      return;
    }
    if (ctx.role && !allow.includes(ctx.role)) {
      navigate({ to: ROLE_HOME[ctx.role] });
    }
  }, [ctx, allow, navigate]);

  if (ctx.loading || !ctx.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }
  if (ctx.role && !allow.includes(ctx.role)) return null;
  return <>{children(ctx)}</>;
}