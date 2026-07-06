interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      style={{
        width: "220px",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          marginBottom: "10px",
          color: "#666",
        }}
      >
        {title}
      </h3>

      <h1>{value}</h1>
    </div>
  );
}