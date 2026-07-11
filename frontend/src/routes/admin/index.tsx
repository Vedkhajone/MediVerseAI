import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Stethoscope, Activity, Building2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, doctors, preds, clinics] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("predictions").select("id", { count: "exact", head: true }),
        supabase.from("clinics").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        doctors: doctors.count ?? 0,
        preds: preds.count ?? 0,
        clinics: clinics.count ?? 0,
      };
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={Users} label="Active users" value={stats.data?.users ?? "—"} />
      <StatCard icon={Stethoscope} label="Doctors" value={stats.data?.doctors ?? "—"} />
      <StatCard icon={Building2} label="Clinics" value={stats.data?.clinics ?? "—"} />
      <StatCard icon={Activity} label="Predictions generated" value={stats.data?.preds ?? "—"} />
    </div>
  );
}