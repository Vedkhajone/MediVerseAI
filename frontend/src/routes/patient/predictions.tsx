import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/predictions")({ component: PredictionsPage });

type DiabetesForm = { glucose: string; bmi: string; insulin: string; age: string; bp: string };
type HeartForm = { cholesterol: string; bp: string; heartRate: string; ecg: string };

// Lightweight in-app heuristic so the UI is usable end-to-end while
// the hosted ML backend gets wired through env config later.
function diabetesScore(f: DiabetesForm) {
  const g = +f.glucose, b = +f.bmi, i = +f.insulin, age = +f.age, bp = +f.bp;
  const s = Math.min(1, Math.max(0, (g - 90) / 110 * 0.45 + (b - 22) / 18 * 0.25 + (i - 50) / 200 * 0.1 + (age - 25) / 50 * 0.1 + (bp - 80) / 60 * 0.1));
  return { score: Number(s.toFixed(2)), positive: s > 0.55 };
}
function heartScore(f: HeartForm) {
  const c = +f.cholesterol, bp = +f.bp, hr = +f.heartRate, ecg = +f.ecg;
  const s = Math.min(1, Math.max(0, (c - 180) / 120 * 0.4 + (bp - 110) / 60 * 0.3 + Math.abs(hr - 75) / 60 * 0.15 + ecg * 0.15));
  return { score: Number(s.toFixed(2)), positive: s > 0.55 };
}
function riskLevel(score: number) {
  if (score < 0.33) return "low";
  if (score < 0.66) return "moderate";
  return "high";
}

function PredictionsPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;
  const qc = useQueryClient();

  const history = useQuery({
    queryKey: ["predictions", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("patient_id", uid!)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (p: {
      kind: "diabetes" | "heart" | "symptom" | "brain_tumor";
      input: Record<string, unknown>;
      score: number;
      positive: boolean;
    }) => {
      if (!uid) throw new Error("Not signed in");
      const { error } = await supabase.from("predictions").insert({
        patient_id: uid,
        kind: p.kind,
        input: p.input as Database["public"]["Tables"]["predictions"]["Insert"]["input"],
        result: { positive: p.positive, score: p.score },
        confidence: p.score,
        risk_level: riskLevel(p.score),
        model_name: "heuristic-v1",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prediction saved");
      qc.invalidateQueries({ queryKey: ["predictions", uid] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  const [diab, setDiab] = useState<DiabetesForm>({ glucose: "", bmi: "", insulin: "", age: "", bp: "" });
  const [heart, setHeart] = useState<HeartForm>({ cholesterol: "", bp: "", heartRate: "", ecg: "0" });
  const [diabResult, setDiabResult] = useState<{ score: number; positive: boolean } | null>(null);
  const [heartResult, setHeartResult] = useState<{ score: number; positive: boolean } | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Disease prediction</CardTitle>
          <CardDescription>Enter clinical values to estimate risk. Results are saved to your history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diabetes">
            <TabsList>
              <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
              <TabsTrigger value="heart">Heart</TabsTrigger>
            </TabsList>
            <TabsContent value="diabetes" className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {(["glucose", "bmi", "insulin", "age", "bp"] as const).map((k) => (
                  <div key={k} className="space-y-1.5">
                    <Label htmlFor={`d-${k}`} className="capitalize">{k === "bp" ? "Blood Pressure (mmHg)" : k}</Label>
                    <Input id={`d-${k}`} type="number" value={diab[k]} onChange={(e) => setDiab({ ...diab, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => {
                  const r = diabetesScore(diab);
                  setDiabResult(r);
                  save.mutate({ kind: "diabetes", input: diab, ...r });
                }}>Predict & save</Button>
                {diabResult && (
                  <Badge variant={diabResult.positive ? "destructive" : "secondary"}>
                    {diabResult.positive ? "Elevated risk" : "Low risk"} · {Math.round(diabResult.score * 100)}%
                  </Badge>
                )}
              </div>
            </TabsContent>
            <TabsContent value="heart" className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {(["cholesterol", "bp", "heartRate", "ecg"] as const).map((k) => (
                  <div key={k} className="space-y-1.5">
                    <Label htmlFor={`h-${k}`} className="capitalize">{k === "bp" ? "Blood Pressure" : k === "ecg" ? "ECG abnormal (0/1)" : k}</Label>
                    <Input id={`h-${k}`} type="number" value={heart[k]} onChange={(e) => setHeart({ ...heart, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => {
                  const r = heartScore(heart);
                  setHeartResult(r);
                  save.mutate({ kind: "heart", input: heart, ...r });
                }}>Predict & save</Button>
                {heartResult && (
                  <Badge variant={heartResult.positive ? "destructive" : "secondary"}>
                    {heartResult.positive ? "Elevated risk" : "Low risk"} · {Math.round(heartResult.score * 100)}%
                  </Badge>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-xs text-muted-foreground">
            AI-generated information is not a substitute for professional medical advice.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Recent prediction results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.data?.length ? history.data.map((p) => (
            <div key={p.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{p.kind.replaceAll("_", " ")}</span>
                <Badge variant="outline" className="capitalize">{p.risk_level ?? "—"}</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(p.created_at).toLocaleString()} · {p.confidence != null ? `${Math.round(Number(p.confidence) * 100)}%` : ""}
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No predictions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}