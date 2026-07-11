import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/analytics")({
  component: () => <PlaceholderPage title="Clinical analytics" description="Trends across your patient panel." />,
});