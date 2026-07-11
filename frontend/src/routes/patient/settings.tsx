import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/patient/settings")({
  component: () => <PlaceholderPage title="Settings" description="Profile, contact details, and notification preferences." />,
});