import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function InsightsPanel() {
  const [metrics, setMetrics] = useState({
    likes: "0",
    comments: "0",
    viralIndex: "0.0",
    confusion: "0.00%"
  });

  const fetchMetrics = async () => {
    try {
      // ✅ Backend port 5000 se real-time data sync
      const res = await axios.get("http://localhost:5000/api/analytics/live-metrics");
      if (res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      // Backend band hone par console clean rakhne ke liye sirf ek baar log
      console.warn("⚠️ Insights Sync: Backend unreachable at port 5000");
    }
  };

  useEffect(() => {
    fetchMetrics();
    // 🔄 Har 5 second mein auto-sync
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🛠️ Metrics mapping with unique keys for console fix
  const metricGroups = [
    {
      type: "grid",
      items: [
        { id: "insight-likes", label: "Likes", value: metrics.likes, color: "from-blue-500 to-cyan-500" },
        { id: "insight-comments", label: "Comments", value: metrics.comments, color: "from-orange-500 to-yellow-500" }
      ]
    },
    {
      type: "stack",
      items: [
        { id: "insight-viral", label: "Viral Index", value: metrics.viralIndex, color: "from-purple-500 to-indigo-500" },
        { id: "insight-confusion", label: "Confusion Rate", value: metrics.confusion, color: "from-pink-500 to-rose-500" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Intelligence</h3>
          <h2 className="text-2xl font-bold text-white mt-1 italic">Real-time Stats</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-ping shadow-[0_0_10px_#10b981]" />
           <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      {metricGroups.map((group, groupIdx) => (
        <div 
          key={`group-${groupIdx}`} 
          className={group.type === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}
        >
          {group.items.map((stat) => (
            <MetricCard 
              key={stat.id} // ✅ Fixes: Encountered two children with same key
              label={stat.label} 
              value={stat.value} 
              color={stat.color} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden backdrop-blur-[1px]"
    >
      <div className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r ${color}`} />
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
      <h4 className="text-xl font-black text-white mt-1 tracking-tighter italic">{value}</h4>
    </motion.div>
  );
}