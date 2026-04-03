import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Activity } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        toast.success("Welcome back to Stocks");
        navigate("/");
      } else {
        toast.error("Please enter email and password");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle Background Pattern/Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-5%] bottom-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] p-8 relative z-10">
        <div className="bg-card border border-border/50 shadow-xl shadow-black/[0.03] rounded-[2rem] p-10 flex flex-col gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:rotate-3">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-foreground tracking-tighter">STOCKS<span className="text-indigo-500">.</span></h1>
              <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest mt-2">Intelligence Center</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/60 rounded-xl py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-body"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/60 rounded-xl py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-body"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 mt-2 text-sm"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">Request access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
