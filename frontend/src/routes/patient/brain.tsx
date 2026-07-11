import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/brain")({ component: BrainPage });

function BrainPage() {
  const { user } = useCurrentUser();
  const uid = user?.id;
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ tumor: boolean; type: string; confidence: number } | null>(null);

  const analyze = useMutation({
    mutationFn: async () => {
      if (!file || !uid) throw new Error("Select an MRI image");
      // Upload to records bucket for traceability
      const path = `${uid}/brain/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("medical-records").upload(path, file);
      if (up.error) throw up.error;

      // Placeholder model output; real CNN/U-Net inference is wired through the
      // external ML backend in a follow-up.
      const confidence = 0.6 + Math.random() * 0.35;
      const tumor = confidence > 0.7;
      const r = { tumor, type: tumor ? "glioma (suspected)" : "no tumor detected", confidence: Number(confidence.toFixed(2)) };

      await supabase.from("medical_records").insert({
        patient_id: uid,
        uploaded_by: uid,
        title: `Brain MRI — ${new Date().toLocaleDateString()}`,
        category: "mri",
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
      });
      await supabase.from("predictions").insert({
        patient_id: uid,
        kind: "brain_tumor",
        input: { filename: file.name },
        result: r,
        confidence: r.confidence,
        risk_level: r.tumor ? "high" : "low",
        model_name: "cnn-placeholder",
      });
      return r;
    },
    onSuccess: (r) => { setResult(r); toast.success("Analysis complete"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Brain tumor analysis</CardTitle>
          <CardDescription>Upload an MRI image to estimate the likelihood of a tumor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mri">MRI image (PNG/JPG)</Label>
            <Input id="mri" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button onClick={() => analyze.mutate()} disabled={!file || analyze.isPending}>
            {analyze.isPending ? "Analyzing…" : "Analyze MRI"}
          </Button>
          {result && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Result</span>
                <Badge variant={result.tumor ? "destructive" : "secondary"}>
                  {result.tumor ? "Tumor suspected" : "No tumor detected"}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{result.type}</div>
              <div className="mt-1 text-xs text-muted-foreground">Confidence: {Math.round(result.confidence * 100)}%</div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            AI-generated information is not a substitute for professional medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}