import {
  LayoutDashboard,
  Users,
  FileText,
  Brain,
  Calendar,
  BarChart3,
  Bot,
  Settings,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Patients", icon: Users },
  { title: "Medical Records", icon: FileText },
  { title: "Predictions", icon: Brain },
  { title: "Appointments", icon: Calendar },
  { title: "Analytics", icon: BarChart3 },
  { title: "AI Assistant", icon: Bot },
  { title: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        background: "#1F2937",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>MediVerse AI</h2>

      <hr />

      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 0",
              cursor: "pointer",
            }}
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </div>
        );
      })}
    </aside>
  );
}