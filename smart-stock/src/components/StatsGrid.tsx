import { DollarSign, Zap, Box, ShieldAlert } from "lucide-react";

const stats = [
  {
    title: "Global Supply Count",
    value: "2,847",
    change: "12%",
    trend: "up" as const,
    icon: Box,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    glowHover: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
  },
  {
    title: "Net Asset Valuation",
    value: "$1.2M",
    change: "8.3%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    glowHover: "group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
  },
  {
    title: "Movement Velocity",
    value: "4.2x",
    change: "0.6%",
    trend: "up" as const,
    icon: Zap,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    glowHover: "group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]"
  },
  {
    title: "Immediate Interventions",
    value: "23",
    change: "5%",
    trend: "down" as const,
    icon: ShieldAlert,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    glowHover: "group-hover:shadow-[0_0_25px_rgba(244,63,94,0.6)]"
  },
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-gradient-to-br from-card to-secondary/20 border border-border/50 overflow-hidden relative shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group rounded-[24px] border-t-white/40"
        >
          {/* Subtle background glow effect */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 ${stat.bgColor.replace('/10', '/5')}`} />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1.5">{stat.title}</p>
               <h3 className="text-3xl font-black font-display text-foreground tracking-tighter drop-shadow-sm">{stat.value}</h3>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl border border-white/10 ${stat.glow} ${stat.glowHover} transition-shadow duration-300 shrink-0`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 relative z-10">
            <span
              className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                stat.trend === "up" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}
            >
              {stat.trend === "up" ? "↑" : "↓"} {stat.change}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">vs last 30 days</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
