import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/appointments")({ component: AppointmentsPage });

function AppointmentsPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;
  const qc = useQueryClient();

  const [when, setWhen] = useState("");
  const [reason, setReason] = useState("");

  const list = useQuery({
    queryKey: ["appointments", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", uid!)
        .order("scheduled_at", { ascending: true });
      return data ?? [];
    },
  });

  const book = useMutation({
    mutationFn: async () => {
      if (!uid || !when) throw new Error("Choose a date and time");
      const { error } = await supabase.from("appointments").insert({
        patient_id: uid,
        scheduled_at: new Date(when).toISOString(),
        reason: reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Appointment requested");
      setWhen(""); setReason("");
      qc.invalidateQueries({ queryKey: ["appointments", uid] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", uid] }),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Your appointments</CardTitle></CardHeader>
        <CardContent>
          {list.data?.length ? (
            <ul className="divide-y">
              {list.data.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{new Date(a.scheduled_at).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{a.reason ?? "No reason given"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{a.status}</Badge>
                    {a.status !== "cancelled" && (
                      <Button size="sm" variant="ghost" onClick={() => cancel.mutate(a.id)}>Cancel</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No appointments yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book appointment</CardTitle>
          <CardDescription>Request a consultation; doctors confirm from their dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="when">Date & time</Label>
            <Input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button className="w-full" onClick={() => book.mutate()} disabled={book.isPending}>
            {book.isPending ? "Requesting…" : "Request appointment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}