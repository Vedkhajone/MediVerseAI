import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/appointments")({
  component: () => <PlaceholderPage title="Appointments" description="Approve, reschedule, or cancel appointments." />,
});