export interface Product {
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
