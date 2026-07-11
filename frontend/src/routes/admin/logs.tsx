import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/logs")({ component: LogsPage });

function LogsPage() {
  const q = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
      return data ?? [];
    },
  });
  return (
    <Card>
      <CardHeader><CardTitle>Audit logs</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead></TableRow></TableHeader>
          <TableBody>
            {q.data?.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{l.action}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.target_table ?? "—"}</TableCell>
              </TableRow>
            ))}
            {!q.data?.length && (
              <TableRow><TableCell colSpan={3} className="text-center text-sm text-muted-foreground">No audit entries yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}