import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/reports")({
  component: () => <PlaceholderPage title="Reports" description="Review uploaded reports from your patients." />,
});