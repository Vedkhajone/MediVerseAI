import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/patient/records")({ component: RecordsPage });

const CATEGORIES = ["lab_report", "mri", "ct_scan", "xray", "prescription", "other"] as const;
type Category = (typeof CATEGORIES)[number];

function RecordsPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;
  const qc = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("lab_report");

  const records = useQuery({
    queryKey: ["records", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!uid || !file) throw new Error("Missing file");
      const path = `${uid}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("medical-records").upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      const ins = await supabase.from("medical_records").insert({
        patient_id: uid,
        uploaded_by: uid,
        title: title || file.name,
        description: description || null,
        category,
        storage_path: path,
        file_size: file.size,
        mime_type: file.type,
      });
      if (ins.error) throw ins.error;
    },
    onSuccess: () => {
      toast.success("Record uploaded");
      setFile(null);
      setTitle("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["records", uid] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Upload failed"),
  });

  async function download(path: string) {
    const { data, error } = await supabase.storage.from("medical-records").createSignedUrl(path, 60);
    if (error || !data) return toast.error(error?.message ?? "Could not create download link");
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Your medical records</CardTitle>
          <CardDescription>Reports, scans, prescriptions — stored privately.</CardDescription>
        </CardHeader>
        <CardContent>
          {records.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : records.data && records.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{r.category}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => download(r.storage_path)}>
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No records yet. Upload one on the right.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload a record</CardTitle>
          <CardDescription>PDF, image, or DICOM-derived file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="rec-title">Title</Label>
            <Input id="rec-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blood panel — June" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rec-desc">Notes</Label>
            <Textarea id="rec-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rec-file">File</Label>
            <Input id="rec-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button className="w-full" disabled={!file || upload.isPending} onClick={() => upload.mutate()}>
            {upload.isPending ? "Uploading…" : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}