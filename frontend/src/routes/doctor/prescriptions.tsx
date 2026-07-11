import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/prescriptions")({
  component: () => <PlaceholderPage title="Prescriptions" description="Issue and manage prescriptions for your patients." />,
});