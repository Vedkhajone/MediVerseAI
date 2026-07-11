import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/admin/models")({
  component: () => <PlaceholderPage title="AI models" description="Configure prediction backends and AI gateway models." />,
});