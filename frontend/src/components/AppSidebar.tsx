import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Activity, Settings, Radio, LogOut, User } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "CDR Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "User Management", icon: Users },
  { to: "/logs", label: "Monitor Logs", icon: Activity },
  { to: "/settings", label: "Connection Settings", icon: Settings },
  { to: "/live", label: "Live Monitoring", icon: Radio },
];

const AppSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 pt-6 pb-5 border-b border-sidebar-border">
        <h1 className="font-serif text-2xl leading-tight font-bold text-sidebar-primary">
          Live Call<br />Monitoring<br />System
        </h1>
      </div>
      <div className="px-6 pt-5 pb-2 text-[10px] font-semibold tracking-widest text-sidebar-foreground/50">
        NAVIGATION
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to === "/dashboard" && pathname === "/");
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-sidebar-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-sidebar-foreground/70">
          <User className="h-3.5 w-3.5" /> admin
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            window.location.href = "/";
          }}
          className="text-sidebar-foreground/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;