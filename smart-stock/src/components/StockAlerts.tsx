import { TrendingDown, ArrowRight, Activity } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Alert {
  id: string;
  product: string;
  sku: string;
  type: "critical" | "low" | "reorder";
  message: string;
  suggestedAction: string;
  quantity: number;
}

const typeConfig = {
  critical: { bg: "bg-destructive/10", border: "border-destructive/20", icon: "text-destructive" },
  low: { bg: "bg-warning/10", border: "border-warning/20", icon: "text-warning" },
  reorder: { bg: "bg-info/10", border: "border-info/20", icon: "text-info" },
};

const StockAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/alerts");
        const data = await response.json();
        const mappedData = data.map((a: any) => ({
          id: a.id.toString(),
          product: a.title.split(': ')[1] || a.title,
          sku: a.message.match(/[A-Z]+-\d+/)?.[0] || "N/A",
          type: a.type === "warning" ? "low" : a.type === "critical" ? "critical" : "reorder",
          message: a.message,
          suggestedAction: a.type === "critical" ? "Order Immediately" : "Schedule Order",
          quantity: 100
        }));
        setAlerts(mappedData.filter((a: any) => !a.read));
      } catch (error) {
        console.error("Error fetching alerts for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleOrder = (alert: Alert) => {
    toast.success(`Purchase order created for ${alert.product}`, {
      description: `Ordering ${alert.quantity} units to reach optimal stock level.`,
    });
  };

  return (
    <div className="bg-card border border-border rounded-[24px] shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-border/60 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="bg-destructive/10 p-2 rounded-xl text-destructive shrink-0">
             <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground tracking-tight">Smart Alerts</h2>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">AI Reorder Suggestions</p>
          </div>
        </div>
        <span className="text-xs bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg font-bold">
          {alerts.length} actions needed
        </span>
      </div>
      <div className="divide-y divide-border/60 flex-1 overflow-y-auto hidden-scrollbar">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Scanning inventory...</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = typeConfig[alert.type];
            return (
              <div key={alert.id} className="p-5 flex items-start sm:items-center flex-col sm:flex-row gap-4 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <div className={`${config.bg} ${config.border} border p-2.5 rounded-xl shrink-0`}>
                    <TrendingDown className={`h-5 w-5 ${config.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{alert.product}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-body font-medium line-clamp-1">{alert.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOrder(alert)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shrink-0"
                >
                  {alert.suggestedAction}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
        {!loading && alerts.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No critical alerts detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlerts;

