import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Activity, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/doctor/")({ component: DoctorHome });

function DoctorHome() {
  const { user } = useCurrentUser();
  const uid = user?.id;

  const stats = useQuery({
    queryKey: ["doctor-stats", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [appts, todays, scripts] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("doctor_id", uid!),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("doctor_id", uid!)
          .gte("scheduled_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
          .lt("scheduled_at", new Date(new Date().setHours(24, 0, 0, 0)).toISOString()),
        supabase.from("prescriptions").select("id", { count: "exact", head: true }).eq("doctor_id", uid!),
      ]);
      return { total: appts.count ?? 0, today: todays.count ?? 0, scripts: scripts.count ?? 0 };
    },
  });

  const upcoming = useQuery({
    queryKey: ["doctor-upcoming", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", uid!)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at")
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Today's appointments" value={stats.data?.today ?? "—"} />
        <StatCard icon={Users} label="Total appointments" value={stats.data?.total ?? "—"} />
        <StatCard icon={ClipboardList} label="Prescriptions issued" value={stats.data?.scripts ?? "—"} />
        <StatCard icon={Activity} label="Active AI module" value="Gemini 3" hint="Report analyzer" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Upcoming appointments</CardTitle></CardHeader>
        <CardContent>
          {upcoming.data?.length ? (
            <ul className="divide-y">
              {upcoming.data.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{new Date(a.scheduled_at).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{a.reason ?? "—"}</div>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{a.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}