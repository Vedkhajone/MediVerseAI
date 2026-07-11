import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/predictions")({
  component: () => <PlaceholderPage title="Predictions" description="AI-generated predictions for your patients." />,
});