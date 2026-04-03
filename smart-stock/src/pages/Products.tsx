import AppShell from "@/components/AppShell";
import { Plus, Search, Filter, MoreVertical, Package, ArrowUpDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearch } from "@/SearchContext";


interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: string;
  status: string;
  image: string;
}

const API_BASE_URL = "http://localhost:8000/api";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();

  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    sku: "",
    price: "",
    stock: "",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80"
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Electronics",
      sku: "",
      price: "",
      stock: "",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      price: product.price.replace('$', ''),
      stock: product.stock.toString(),
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    const stockNum = parseInt(formData.stock);
    const productData = {
      name: formData.name,
      sku: formData.sku,
      price: `$${parseFloat(formData.price.replace(/[^0-9.]/g, '')).toFixed(2)}`,
      stock: stockNum,
      category: formData.category,
      status: stockNum > 50 ? "Optimal" : stockNum > 0 ? "Low Stock" : "Out of Stock",
      image: formData.image
    };

    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products`;
      
      const method = editingProduct ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error(`Failed to ${editingProduct ? 'update' : 'add'} product`);
      
      const savedProduct = await response.json();
      
      if (editingProduct) {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
        toast.success("Product updated successfully!");
      } else {
        setProducts([savedProduct, ...products]);
        toast.success("Product added successfully!");
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${editingProduct ? 'updating' : 'adding'} product:`, error);
      toast.error(`Failed to ${editingProduct ? 'update' : 'add'} product`);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete product");
      
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };


  return (
    <AppShell>
      <div className="space-y-8 max-w-[1600px] mx-auto min-h-screen pb-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your inventory catalog and product details.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border p-4 rounded-[20px] shadow-sm">
          <div className="flex-1 w-full relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground placeholder:text-muted-foreground shadow-inner"
            />

          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="bg-secondary text-foreground hover:bg-muted transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold border border-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <div className="flex items-center bg-secondary p-1 rounded-xl border border-transparent">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Package className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-[24px] overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-muted/30 relative overflow-hidden border-b border-border/60">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-border/50 text-foreground shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{product.name}</h3>
                  <div className="relative inline-block text-left group/menu">
                    <button className="text-muted-foreground hover:bg-secondary hover:text-foreground p-1 rounded-md transition-colors shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 w-32 mt-1 origin-top-right bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-secondary text-foreground font-medium transition-colors"
                      >
                        Edit Product
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive font-medium transition-colors"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded border border-border/50">{product.sku}</span>
                </div>
                
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/40">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Price</p>
                    <span className="font-bold text-lg text-foreground tracking-tight leading-none">{product.price}</span>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                    product.status === "Optimal" ? "bg-emerald-500/10 text-emerald-500" : 
                    product.status === "Low Stock" ? "bg-amber-500/10 text-amber-500" : 
                    "bg-rose-500/10 text-rose-500"
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-[24px]">
             <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
             <h3 className="text-lg font-semibold text-foreground">No products found</h3>
             <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query.</p>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-background/60 backdrop-blur-sm"
               onClick={() => setIsModalOpen(false)}
            />
            <div className="bg-card border border-border w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{editingProduct ? "Modify existing entries." : "Enter details to add to inventory."}</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Product Name</label>
                       <input 
                         required
                         type="text" 
                         placeholder="e.g. Ultra Gaming Mouse"
                         className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Category</label>
                         <select 
                           className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                         >
                            <option>Electronics</option>
                            <option>Accessories</option>
                            <option>Displays</option>
                            <option>Furniture</option>
                            <option>Networking</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">SKU</label>
                         <input 
                           required
                           type="text" 
                           placeholder="GEN-001"
                           className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                           value={formData.sku}
                           onChange={(e) => setFormData({...formData, sku: e.target.value})}
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Price ($)</label>
                         <input 
                           required
                           type="text" 
                           placeholder="0.00"
                           className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                           value={formData.price}
                           onChange={(e) => setFormData({...formData, price: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Stock Level</label>
                         <input 
                           required
                           type="number" 
                           placeholder="0"
                           className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                           value={formData.stock}
                           onChange={(e) => setFormData({...formData, stock: e.target.value})}
                         />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Product Image URL</label>
                       <input 
                         type="url" 
                         placeholder="https://images.unsplash.com/..."
                         className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                         value={formData.image}
                         onChange={(e) => setFormData({...formData, image: e.target.value})}
                       />
                       <p className="text-[10px] text-muted-foreground ml-1">Enter a valid image URL to update product visualization.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button 
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 bg-secondary hover:bg-muted text-foreground font-bold py-4 rounded-2xl transition-all border border-border/50"
                     >
                        Cancel
                     </button>
                     <button 
                       type="submit"
                       className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all"
                     >
                        {editingProduct ? "Save Changes" : "Confirm Addition"}
                     </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Products;
