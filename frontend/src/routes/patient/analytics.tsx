import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

export const Route = createFileRoute("/patient/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;

  const preds = useQuery({
    queryKey: ["analytics-preds", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("predictions").select("kind,confidence,created_at").eq("patient_id", uid!).order("created_at");
      return data ?? [];
    },
  });

  const timeline = (preds.data ?? []).map((p) => ({
    date: new Date(p.created_at).toLocaleDateString(),
    confidence: p.confidence != null ? Math.round(Number(p.confidence) * 100) : 0,
  }));
  const byKind = Object.values((preds.data ?? []).reduce<Record<string, { kind: string; count: number }>>((acc, p) => {
    acc[p.kind] = acc[p.kind] ?? { kind: p.kind, count: 0 };
    acc[p.kind].count += 1;
    return acc;
  }, {}));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Risk score over time</CardTitle><CardDescription>Confidence of each AI prediction.</CardDescription></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="confidence" stroke="var(--color-primary, #10b981)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Predictions by type</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byKind}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="kind" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary, #10b981)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}