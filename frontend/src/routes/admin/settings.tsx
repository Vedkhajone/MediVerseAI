import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/admin/settings")({
  component: () => <PlaceholderPage title="Settings" description="Platform settings and permissions." />,
});