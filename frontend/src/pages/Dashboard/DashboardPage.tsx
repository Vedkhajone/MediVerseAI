import AppShell from "../../components/layout/AppShell";
import WelcomeSection from "../../components/dashboard/WelcomeSection";
import QuickActions from "../../components/dashboard/QuickActions";
import OverviewCards from "../../components/dashboard/OverviewCards";
import RecentActivity from "../../components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <WelcomeSection />

      <QuickActions />

      <OverviewCards />

      <RecentActivity />
    </AppShell>
  );
}