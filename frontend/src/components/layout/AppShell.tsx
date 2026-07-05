import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "./Header";

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export default function AppShell({
  title,
  children,
}: AppShellProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
       <Header title={title} />

        <main
          style={{
            padding: "20px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}