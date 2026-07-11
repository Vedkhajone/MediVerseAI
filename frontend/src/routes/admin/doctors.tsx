import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
export const Route = createFileRoute("/admin/doctors")({
  component: () => <PlaceholderPage title="Doctors" description="Manage doctor profiles, specialties, and clinic assignments." />,
});