import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";

const categoryData = [
  { name: "Electronics", current: 1230, capacity: 1500 },
  { name: "Accessories", current: 850, capacity: 1200 },
  { name: "Furniture", current: 420, capacity: 600 },
  { name: "Displays", current: 1100, capacity: 1100 },
  { name: "Audio", current: 950, capacity: 1300 },
];

const statusDistribution = [
  { name: "Optimal", value: 65, color: "#10B981" },
  { name: "Low Stock", value: 25, color: "#F59E0B" },
  { name: "Out of Stock", value: 10, color: "#EF4444" },
];

const trendData = [
  { time: "08:00", supply: 400, demand: 240 },
  { time: "10:00", supply: 300, demand: 139 },
  { time: "12:00", supply: 200, demand: 980 },
  { time: "14:00", supply: 278, demand: 390 },
  { time: "16:00", supply: 189, demand: 480 },
  { time: "18:00", supply: 239, demand: 380 },
  { time: "20:00", supply: 349, demand: 430 },
];

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid hsl(var(--border))',
  borderRadius: '16px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  padding: '12px 16px',
};

const StockCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inventory Utilization Line Chart */}
      <div className="bg-gradient-to-br from-card to-secondary/30 border border-border/50 rounded-[24px] p-6 border-t-white/40 shadow-sm flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
        <h3 className="text-base font-display font-bold text-foreground mb-6 relative z-10">Inventory Utilization</h3>
        <div className="flex-1 w-full relative z-10">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#8B5CF6" 
                strokeWidth={4} 
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#8B5CF6" }}
              />
              <Line 
                type="monotone" 
                dataKey="capacity" 
                stroke="#C4B5FD" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Health Gauge */}
      <div className="bg-gradient-to-br from-card to-secondary/30 border border-border/50 rounded-[24px] p-6 border-t-white/40 shadow-sm flex flex-col items-center relative overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mb-10 transition-transform group-hover:scale-150 duration-700" />
        <h3 className="text-base font-display font-bold text-foreground mb-2 self-start relative z-10">Stock Index</h3>
        <div className="flex-1 w-full flex items-center justify-center relative z-10 mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={95}
                dataKey="value"
                stroke="none"
                paddingAngle={2}
                cornerRadius={10}
              >
                {statusDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-4xl font-black font-display tracking-tighter text-emerald-500 drop-shadow-sm">A+</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">Excellent</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 relative z-10 w-full px-2">
          {statusDistribution.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}80` }} />
              <span className="truncate">{s.name}</span>
              <span className="text-foreground ml-auto">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Flow Network Chart */}
      <div className="bg-gradient-to-br from-card to-secondary/30 border border-border/50 rounded-[24px] p-6 border-t-white/40 shadow-sm relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700" />
        <h3 className="text-base font-display font-bold text-foreground mb-6 relative z-10">Supply/Demand Flow</h3>
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="flowIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="flowOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 500 }} />
              
              {/* Flow Out (Demand) */}
              <Area 
                type="monotone" 
                dataKey="demand" 
                name="Outgoing (Demand)" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fill="url(#flowOut)" 
                filter="url(#glow)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6", style: { filter: "url(#glow)" } }} 
              />
              {/* Flow In (Supply) */}
              <Area 
                type="monotone" 
                dataKey="supply" 
                name="Incoming (Supply)" 
                stroke="#10b981" 
                strokeWidth={3} 
                fill="url(#flowIn)" 
                filter="url(#glow)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981", style: { filter: "url(#glow)" } }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StockCharts;
