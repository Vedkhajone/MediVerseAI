import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, CalendarDays, FileText, Pill } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/patient/")({ component: PatientHome });

function PatientHome() {
  const { user, fullName } = useCurrentUser();
  const uid = user?.id;

  const stats = useQuery({
    queryKey: ["patient", "stats", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [records, meds, appts, preds] = await Promise.all([
        supabase.from("medical_records").select("id", { count: "exact", head: true }).eq("patient_id", uid!),
        supabase.from("medications").select("id", { count: "exact", head: true }).eq("patient_id", uid!).eq("active", true),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("patient_id", uid!).gte("scheduled_at", new Date().toISOString()),
        supabase.from("predictions").select("id", { count: "exact", head: true }).eq("patient_id", uid!),
      ]);
      return {
        records: records.count ?? 0,
        meds: meds.count ?? 0,
        appts: appts.count ?? 0,
        preds: preds.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["patient", "recent", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("predictions")
        .select("id,kind,risk_level,confidence,created_at")
        .eq("patient_id", uid!)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome{fullName ? `, ${fullName.split(" ")[0]}` : ""}.</h2>
        <p className="text-sm text-muted-foreground">Here is a snapshot of your health workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Records" value={stats.data?.records ?? "—"} hint="Reports & scans uploaded" />
        <StatCard icon={Pill} label="Active medications" value={stats.data?.meds ?? "—"} hint="Currently on regimen" />
        <StatCard icon={CalendarDays} label="Upcoming visits" value={stats.data?.appts ?? "—"} hint="Booked appointments" />
        <StatCard icon={Activity} label="Predictions" value={stats.data?.preds ?? "—"} hint="AI risk assessments" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent AI predictions</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/patient/predictions">New prediction</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recent.data && recent.data.length > 0 ? (
              <ul className="divide-y">
                {recent.data.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <div className="font-medium capitalize">{r.kind.replaceAll("_", " ")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{r.risk_level ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.confidence != null ? `${Math.round(Number(r.confidence) * 100)}% confidence` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No predictions yet. Try the diabetes or heart risk forms.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/patient/records">Upload a report</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/patient/appointments">Book appointment</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/patient/medications">Add medication</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/patient/assistant">Ask the AI assistant</Link></Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        AI-generated information is not a substitute for professional medical advice.
      </p>
    </div>
  );
}