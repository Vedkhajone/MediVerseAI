import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/admin/analytics")({
  component: () => <PlaceholderPage title="Platform analytics" description="System-wide usage, storage, and AI module activity." />,
});