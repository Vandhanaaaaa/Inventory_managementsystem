import AppShell from "@/components/AppShell";
import { User, Bell, Shield, Wallet, Building, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    avatar: null
  });
  const [company, setCompany] = useState({
    name: "",
    address: "",
    tax_id: "",
    phone: "",
    email: ""
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchCompany();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/company`);
      if (!response.ok) throw new Error("Failed to fetch company");
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email
        })
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company)
      });

      if (!response.ok) throw new Error("Failed to update company");
      
      const updatedCompany = await response.json();
      setCompany(updatedCompany);
      toast.success("Company details updated successfully!");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-[1200px] mx-auto">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your profile, notifications, and application preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"}`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab("update-details")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === "update-details" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"}`}
            >
              <Building className="h-4 w-4" />
              Update Details
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === "notifications" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"}`}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === "security" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"}`}
            >
              <Shield className="h-4 w-4" />
              Security
            </button>
            <button 
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === "billing" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"}`}
            >
              <Wallet className="h-4 w-4" />
              Billing
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-display font-bold text-foreground mb-6">Profile Settings</h2>
                
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-secondary/80 border-2 border-border flex items-center justify-center overflow-hidden shrink-0">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Profile Picture</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">JPG, GIF or PNG. 1MB max.</p>
                      <div className="flex gap-3">
                        <button type="button" className="bg-secondary text-foreground hover:bg-muted font-semibold px-4 py-2 rounded-xl text-sm transition-colors border border-border/50 shadow-sm">
                          Upload Data
                        </button>
                        <button type="button" className="text-destructive font-semibold px-4 py-2 hover:bg-destructive/10 rounded-xl text-sm transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">First Name</label>
                      <input 
                        type="text" 
                        value={profile.first_name} 
                        onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                        className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.last_name} 
                        onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                        className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-semibold text-foreground">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-semibold text-foreground">Role</label>
                      <input type="text" value={profile.role} disabled className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-muted-foreground opacity-70 cursor-not-allowed shadow-inner" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {saving ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "update-details" && (
              <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Company Information</h2>
                    <p className="text-sm text-muted-foreground">Manage your business details and legal information.</p>
                  </div>
                </div>
                
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Loading company records...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveCompany} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-foreground">Company Legal Name</label>
                        <input 
                          required
                          type="text" 
                          value={company.name} 
                          onChange={(e) => setCompany({...company, name: e.target.value})}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-foreground">Registered Address</label>
                        <textarea 
                          required
                          rows={3}
                          value={company.address} 
                          onChange={(e) => setCompany({...company, address: e.target.value})}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner resize-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Tax / VAT ID</label>
                        <input 
                          required
                          type="text" 
                          value={company.tax_id} 
                          onChange={(e) => setCompany({...company, tax_id: e.target.value})}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Phone Number</label>
                        <input 
                          type="tel" 
                          value={company.phone} 
                          onChange={(e) => setCompany({...company, phone: e.target.value})}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-foreground">Billing Email</label>
                        <input 
                          type="email" 
                          value={company.email} 
                          onChange={(e) => setCompany({...company, email: e.target.value})}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-inner" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        {saving ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                        Update Details
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Notifications</h2>
                    <p className="text-sm text-muted-foreground">Manage how you receive alerts and updates.</p>
                  </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Inventory Alerts</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">AI Reorder Suggestions</h4>
                        <p className="text-sm text-muted-foreground mt-1">Receive automated predictions for inventory restocks.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">Critical Stock Warnings</h4>
                        <p className="text-sm text-muted-foreground mt-1">Instant alerts when items hit critical levels.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Reports</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">Weekly Digest Email</h4>
                        <p className="text-sm text-muted-foreground mt-1">Receive a summary of inventory changes every Monday.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Security</h2>
                    <p className="text-sm text-muted-foreground">Manage your credentials and account protection.</p>
                  </div>
                </div>

                <form className="space-y-6 max-w-2xl">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Change Password</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner" />
                      </div>
                    </div>
                    <button type="button" className="bg-secondary text-foreground hover:bg-muted font-semibold px-4 py-2 rounded-xl text-sm transition-colors border border-border/50 shadow-sm mt-2">
                      Update Password
                    </button>
                  </div>

                  <hr className="border-border/60" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">Two-Factor Authentication (2FA)</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">Secure your account with an extra layer of protection.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Billing & Subscription</h2>
                    <p className="text-sm text-muted-foreground">Manage your plan, payments, and history.</p>
                  </div>
                </div>

                <div className="space-y-8 max-w-2xl">
                  {/* Current Plan Card */}
                  <div className="bg-primary text-primary-foreground p-6 rounded-[24px] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Wallet className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Current Plan</p>
                          <h3 className="text-2xl font-display font-bold mt-1">Professional Edition</h3>
                        </div>
                        <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm uppercase tracking-wider">Active</span>
                      </div>
                      <div className="mt-8 flex items-baseline gap-1">
                        <span className="text-4xl font-bold">$49.00</span>
                        <span className="text-sm opacity-80">/ month</span>
                      </div>
                      <p className="text-xs mt-4 opacity-80 font-medium italic">Next billing date: April 15, 2026</p>
                      <button className="mt-6 w-full bg-white text-primary font-bold py-2.5 rounded-xl text-sm hover:bg-muted transition-colors shadow-sm">
                        Upgrade Plan
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Payment Method</h3>
                    <div className="flex items-center justify-between border border-border p-4 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-secondary p-2 rounded-lg">
                          <Wallet className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Visa ending in 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                    </div>
                  </div>

                  {/* Billing History (Brief) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Invoices</h3>
                    <div className="divide-y divide-border/60">
                      {[ 
                        { date: "Mar 15, 2026", amount: "$49.00", id: "INV-2026-003" },
                        { date: "Feb 15, 2026", amount: "$49.00", id: "INV-2026-002" }
                      ].map((inv) => (
                        <div key={inv.id} className="py-3 flex justify-between items-center group">
                          <div>
                            <p className="text-sm font-medium text-foreground">{inv.date}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{inv.id}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-foreground">{inv.amount}</span>
                            <button className="text-muted-foreground hover:text-foreground">
                              <Wallet className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;

