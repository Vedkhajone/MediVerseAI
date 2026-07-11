import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

export function PlaceholderPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {children ?? (
            <p>
              This module is part of the MediVerse AI scope and will be expanded with full
              functionality. The data layer, RLS policies, and routing are already wired.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}