import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/settings")({
  component: () => <PlaceholderPage title="Settings" description="Profile, schedule, and notification preferences." />,
});