import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/doctor/patients")({
  component: () => <PlaceholderPage title="Patients" description="Browse patients assigned to you and view their history." />,
});