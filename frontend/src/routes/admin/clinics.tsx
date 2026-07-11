import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/admin/clinics")({
  component: () => <PlaceholderPage title="Clinics" description="Configure clinics on the platform." />,
});