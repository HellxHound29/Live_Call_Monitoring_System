import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Menu, Settings, User } from "lucide-react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-page">
      {sidebarOpen && <AppSidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-surface border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3 text-sm text-foreground/70">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
              className="hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span>Call Recording & Monitoring Tool</span>
          </div>
          <div className="flex items-center gap-4 text-foreground/60">
            <button
              onClick={() => navigate("/settings")}
              aria-label="Settings"
              className="hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/users")}
              aria-label="Account"
              className="hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;