import AppShell from "@/components/AppShell";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8000/api";

// Initial data will be replaced by API calls

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  fontSize: "13px",
  color: "hsl(var(--foreground))",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
};

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [summary, setSummary] = useState({
    total_revenue: "$0",
    net_profit: "$0",
    items_sold: "0",
    avg_order_value: "$0"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, catRes, sumRes] = await Promise.all([
          fetch(`${API_BASE_URL}/analytics/revenue`),
          fetch(`${API_BASE_URL}/analytics/categories`),
          fetch(`${API_BASE_URL}/analytics/summary`)
        ]);

        setRevenueData(await revRes.json());
        setCategoryPerformance(await catRes.json());
        setSummary(await sumRes.json());
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <AppShell>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Deep dive into your sales, inventory, and revenue metrics.</p>
          </div>
          <select className="bg-card border border-border text-foreground font-medium px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <span className="flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp className="h-3 w-3" /> +14.5%
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{summary.total_revenue}</p>
          </div>

          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-success/10 p-3 rounded-2xl">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <span className="flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp className="h-3 w-3" /> +8.2%
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Net Profit</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{summary.net_profit}</p>
          </div>

          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-info/10 p-3 rounded-2xl">
                <Package className="h-6 w-6 text-info" />
              </div>
              <span className="flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingDown className="h-3 w-3" /> -2.1%
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Items Sold</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{summary.items_sold}</p>
          </div>

          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-warning/10 p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <span className="flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp className="h-3 w-3" /> +5.4%
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider relative z-10">Avg Order Value</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1 relative z-10">{summary.avg_order_value}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm lg:col-span-2 hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-lg font-display font-bold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground font-medium">Monthly revenue vs profit</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--success))" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-lg font-display font-bold text-foreground">Sales by Category</h3>
              <p className="text-xs text-muted-foreground font-medium">Top performing categories</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--secondary))" }} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Analytics;
