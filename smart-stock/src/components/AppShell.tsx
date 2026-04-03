import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  AlertTriangle,
  Settings,
  ChevronLeft,
  Search,
  Bell,
  Activity,
  LogOut,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { useSearch } from "../SearchContext";
import { toast } from "sonner";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const AppShell = ({ children }: AppShellProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`bg-card flex flex-col border-r border-border transition-all duration-300 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
          collapsed ? "w-20" : "w-64"
        } hidden md:flex`}
      >
        <div className="p-6 flex items-center gap-3 h-[72px]">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-indigo-500/30">
            <Activity className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 pl-1">
              <h1 className="font-display font-black text-xl text-foreground tracking-tighter truncate leading-tight">
                STOCKS<span className="text-indigo-500">.</span>
              </h1>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto hidden-scrollbar">
          {!collapsed && <p className="px-3 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">Main Menu</p>}
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              activeClassName="bg-primary/10 text-primary shadow-sm"
              pendingClassName="text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className={`h-5 w-5 shrink-0 transition-colors`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border/50">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 group relative ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <LogOut className="h-5 w-5 shrink-0 transition-colors group-hover:text-destructive" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full min-w-0">
        {/* Top bar */}
        <header className="bg-background border-b border-border/40 px-6 py-3 flex items-center justify-between shrink-0 h-[72px]">
          <div className="flex items-center gap-2.5 md:hidden">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 rounded-lg text-white shadow-md shadow-indigo-500/20">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-display font-black text-xl text-foreground tracking-tighter">STOCKS<span className="text-indigo-500">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-2 w-[400px] shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-shadow">
            <Search className="h-4 w-4 text-muted-foreground ml-1" />
            <input
              type="text"
              placeholder="Search products, SKUs, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 font-body text-foreground placeholder:-muted-foreground/60 w-full min-w-0 px-2 leading-none"
            />
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">
            <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-transparent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-border/50 ml-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold cursor-pointer hover:bg-primary/20 transition-colors">
                AD
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors group"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background relative hidden-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {children}
        </main>
      </div>
      
      {/* Hide Scrollbar CSS injection */}
      <style>{`
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AppShell;
