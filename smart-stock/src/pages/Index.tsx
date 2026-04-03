import AppShell from "@/components/AppShell";
import StatsGrid from "@/components/StatsGrid";
import StockCharts from "@/components/StockCharts";
import InventoryTable from "@/components/InventoryTable";
import StockAlerts from "@/components/StockAlerts";

const Index = () => {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time inventory insights and optimization recommendations
            </p>
          </div>
        </div>

        <StatsGrid />

        <StockCharts />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <InventoryTable />
          </div>
          <div className="xl:col-span-2">
            <StockAlerts />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
