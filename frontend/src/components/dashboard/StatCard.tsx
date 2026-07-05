interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        width: "220px",
        background: "white",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}