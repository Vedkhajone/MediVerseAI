import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { Pill } from "lucide-react";

export const Route = createFileRoute("/patient/medications")({ component: MedsPage });

function MedsPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [times, setTimes] = useState("08:00");

  const meds = useQuery({
    queryKey: ["meds", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("medications").select("*").eq("patient_id", uid!).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!uid || !name) throw new Error("Name required");
      const { error } = await supabase.from("medications").insert({
        patient_id: uid,
        name,
        dosage,
        frequency,
        times_of_day: times.split(",").map((s) => s.trim()).filter(Boolean),
        start_date: new Date().toISOString().slice(0, 10),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Medication added");
      setName(""); setDosage("");
      qc.invalidateQueries({ queryKey: ["meds", uid] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const toggle = useMutation({
    mutationFn: async (m: { id: string; active: boolean }) => {
      const { error } = await supabase.from("medications").update({ active: !m.active }).eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meds", uid] }),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Medications</CardTitle><CardDescription>Track active medications and reminder times.</CardDescription></CardHeader>
        <CardContent>
          {meds.data?.length ? (
            <ul className="divide-y">
              {meds.data.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Pill className="h-4 w-4" /></div>
                    <div>
                      <div className="text-sm font-medium">{m.name} <span className="text-xs text-muted-foreground">{m.dosage}</span></div>
                      <div className="text-xs text-muted-foreground">{m.frequency} · {(m.times_of_day ?? []).join(", ")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch checked={m.active} onCheckedChange={() => toggle.mutate({ id: m.id, active: m.active })} />
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No medications yet.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Add medication</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Metformin" /></div>
          <div className="space-y-1.5"><Label>Dosage</Label><Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="500 mg" /></div>
          <div className="space-y-1.5"><Label>Frequency</Label><Input value={frequency} onChange={(e) => setFrequency(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Times (comma separated)</Label><Input value={times} onChange={(e) => setTimes(e.target.value)} placeholder="08:00, 20:00" /></div>
          <Button className="w-full" onClick={() => add.mutate()} disabled={add.isPending}>{add.isPending ? "Adding…" : "Add medication"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}