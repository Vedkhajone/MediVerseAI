import StatCard from "./StatCard";

export default function OverviewCards() {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "30px",
      }}
    >
      <StatCard title="Patients" value={1250} />

      <StatCard title="Doctors" value={402} />

      <StatCard title="Medical Reports" value={563} />

      <StatCard title="AI Predictions" value={3290} />

      <StatCard
    title="Appointments"
    value={87}
/>
    </div>
  );
}