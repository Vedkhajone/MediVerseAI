import AppShell from "../../components/layout/AppShell";
import StatCard from "../../components/dashboard/StatCard";
export default function DashboardPage() {
  return (
    <AppShell title="Patients">
      <h1>Welcome back, Ved 👋</h1>

      <p>Let's build the future of healthcare.</p>

      <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
  }}
>
  <StatCard
    title="Patients"
    value={1250}
  />

  <StatCard
    title="Doctors"
    value={42}
  />

  <StatCard
    title="Medical Reports"
    value={563}
  />

  <StatCard
    title="AI Predictions"
    value={3290}
  />
</div>
    </AppShell>
  );
}