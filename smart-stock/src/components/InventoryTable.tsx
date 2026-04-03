import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearch } from "@/SearchContext";


interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  optimalStock: number;
  unitCost: number;
  status: "optimal" | "low" | "critical" | "overstock";
}

const statusConfig: Record<Product["status"], { label: string; className: string }> = {

  optimal: { label: "Optimal", className: "bg-success/10 text-success border-success/20" },
  low: { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20" },
  overstock: { label: "Overstock", className: "bg-info/10 text-info border-info/20" },
};

const InventoryTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();
        const mappedData = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          sku: p.sku,
          category: p.category,
          currentStock: p.stock,
          reorderPoint: 50, // Placeholder as not in current model
          optimalStock: 100, // Placeholder as not in current model
          unitCost: parseFloat(p.price.replace('$', '')),
          status: p.status.toLowerCase() === "optimal" ? "optimal" : 
                  p.status.toLowerCase() === "low stock" ? "low" : 
                  p.status.toLowerCase() === "out of stock" ? "critical" : "overstock"
        }));
        setProducts(mappedData);
      } catch (error) {
        console.error("Error fetching products for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesStatus = filter === "all" || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });


  return (
    <div className="bg-card border border-border shadow-sm rounded-[24px] overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground tracking-tight">Inventory Overview</h2>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Manage and monitor all your product variants</p>
        </div>
        <div className="flex gap-1.5 flex-wrap bg-secondary p-1.5 rounded-xl border border-border/50">
          {["all", "critical", "low", "optimal", "overstock"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto hidden-scrollbar">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-semibold text-muted-foreground whitespace-nowrap">
                <span className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">Product <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">SKU</th>
              <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-right p-4 font-semibold text-muted-foreground">Stock</th>
              <th className="text-right p-4 font-semibold text-muted-foreground hidden lg:table-cell">Reorder Pt</th>
              <th className="text-right p-4 font-semibold text-muted-foreground hidden lg:table-cell">Optimal</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs text-muted-foreground font-medium">Updating inventory records...</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-muted-foreground italic">
                  No matching products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const stockPercent = Math.round((product.currentStock / product.optimalStock) * 100);
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 font-semibold text-foreground">{product.name}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs bg-secondary rounded mx-2 w-fit px-2 py-1 h-fit inline-block mt-3">{product.sku}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{product.category}</td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-foreground">{product.currentStock}</span>
                      <div className="w-full bg-secondary rounded-full h-1.5 mt-2 overflow-hidden border border-border/50">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            stockPercent > 100 ? "bg-info" : stockPercent > 50 ? "bg-success" : stockPercent > 25 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${Math.min(stockPercent, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{product.reorderPoint}</td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{product.optimalStock}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`font-semibold ${statusConfig[product.status as keyof typeof statusConfig]?.className || ""}`}>
                        {statusConfig[product.status as keyof typeof statusConfig]?.label || product.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <button className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
