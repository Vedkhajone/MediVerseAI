import AppShell from "../../components/layout/AppShell";
import OverviewCards from "../../components/dashboard/OverviewCards";
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
><OverviewCards />
</div>
    </AppShell>
  );
}