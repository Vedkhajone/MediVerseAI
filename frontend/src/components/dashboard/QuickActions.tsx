export default function QuickActions() {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "30px",
      }}
    >
      <button>Add Patient</button>

      <button>Upload Report</button>

      <button>New Prediction</button>
    </div>
  );
}