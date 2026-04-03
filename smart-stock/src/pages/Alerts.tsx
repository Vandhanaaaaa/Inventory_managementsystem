import AppShell from "@/components/AppShell";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, MoreVertical, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000/api";

// Mock alerts will be replaced by API data
interface Alert {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error("Failed to load alerts");
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
        method: "PATCH"
      });
      if (response.ok) {
        setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
        toast.success("Alert marked as read");
      }
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === "all") return true;
    if (filter === "unread") return !a.read;
    return a.type === filter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <AppShell>
      <div className="space-y-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Alerts</h1>
            <p className="text-sm text-muted-foreground mt-1">Stay on top of critical stock levels and system updates.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Mark all as read
            </button>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Notification Settings
            </button>
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-[24px] overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-1.5 flex-wrap bg-secondary p-1.5 rounded-xl border border-border/50 w-full sm:w-auto overflow-x-auto">
              {["all", "unread", "critical", "warning"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 whitespace-nowrap ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  {f === "unread" ? `Unread (${unreadCount})` : f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search alerts..." 
                className="w-full sm:w-64 bg-secondary border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-border/60">
            {filteredAlerts.length === 0 ? (
               <div className="p-20 text-center text-muted-foreground italic">No alerts found.</div>
            ) : filteredAlerts.map((alert) => {
              const Icon = 
                alert.type === "critical" ? AlertCircle :
                alert.type === "warning" ? AlertTriangle :
                alert.type === "success" ? CheckCircle2 : Info;
              
              const colorClass = 
                alert.type === "critical" ? "text-destructive bg-destructive/10" :
                alert.type === "warning" ? "text-warning bg-warning/10" :
                alert.type === "success" ? "text-success bg-success/10" : "text-info bg-info/10";

              return (
                <div key={alert.id} className={`p-4 sm:p-6 flex items-start gap-4 transition-colors hover:bg-muted/30 group ${!alert.read ? "bg-primary/5" : ""}`}>
                  <div className={`p-3 rounded-2xl shrink-0 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-semibold text-foreground ${!alert.read ? "font-bold" : ""}`}>
                        {alert.title}
                        {!alert.read && <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 mb-0.5"></span>}
                      </h3>
                      <span className="text-xs text-muted-foreground shrink-0 font-medium">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                    <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!alert.read && <button onClick={() => markAsRead(alert.id)} className="text-xs font-semibold text-primary hover:underline">Mark as read</button>}
                      <button className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline">View details</button>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:bg-secondary hover:text-foreground p-1.5 rounded-xl transition-colors shrink-0">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Alerts;
