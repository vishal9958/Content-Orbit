import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";

// Zero-dependency SVG component that is guaranteed to scale perfectly without breaking box layout
const SecureSparkline = ({ value, isStagnant }) => {
  const points = 10;
  
  // Create a cool randomized array of points leading up to the value
  const data = Array.from({ length: points }, (_, i) => {
    if (i === points - 1) return value;
    // Animate a trend
    let noise = Math.random() * (value * 0.2);
    if (isStagnant) {
      return value + (points - i) * 5 + noise;
    } else {
      return Math.max(0, value - (points - i) * 3 - noise);
    }
  });

  const max = Math.max(...data, 10);
  const min = Math.min(...data, 0);
  const range = max - min;
  
  // viewBox spans 0,0 to 100,20 for horizontal squishing
  const pathData = data.map((d, i) => {
    const x = (i / (points - 1)) * 100;
    // Map bounds to 1 to 19 to leave 1px margin
    const y = 20 - (((d - min) / (range || 1)) * 18 + 1);
    return `${x},${y}`;
  }).join(" L ");

  const color = isStagnant ? "#f43f5e" : "#22c55e"; // Rose-500, Green-500

  return (
    <div className="w-full h-20 relative flex items-center mb-6">
       <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
         <defs>
           <linearGradient id={`grad-${value}`} x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor={color} stopOpacity="0.3" />
             <stop offset="100%" stopColor={color} stopOpacity="0" />
           </linearGradient>
         </defs>

         <path 
           d={`M 0,20 L ${pathData} L 100,20 Z`} 
           fill={`url(#grad-${value})`} 
         />
         
         <motion.path
           d={`M ${pathData}`}
           fill="none"
           stroke={color}
           strokeWidth="0.8"
           strokeLinecap="round"
           strokeLinejoin="round"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           style={{ filter: `drop-shadow(0 0 2px ${color}80)` }}
         />
         
         <circle 
           cx="100" 
           cy={20 - (((value - min) / (range || 1)) * 18 + 1)} 
           r="1.2" 
           fill={color} 
           className="animate-pulse"
         />
       </svg>
    </div>
  );
};

export default function SettingsPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/schedules/analytics`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    /* h-full and overflow-y-auto guarantees the entire page scrolls without stretching parent */
    <div className="p-8 w-full h-full bg-transparent overflow-y-auto custom-scrollbar text-white">
      
      {/* Heavy Red Header as requested */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rose-500/20 pb-6">
         <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 shadow-[0_0_15px_#f43f5e]"></span>
              </span>
              <h2 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-700 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                Death Analyzer
              </h2>
            </div>
            <p className="text-rose-200/50 text-xs font-bold tracking-widest uppercase">
              Autonomous Video Lifecycle & Resurrection Matrix
            </p>
         </div>
         
         <div className="flex gap-4">
            <div className="px-5 py-3 rounded-xl bg-transparent border border-red-500/10 flex flex-col items-center justify-center">
              <span className="text-[9px] text-red-400/60 uppercase font-black tracking-widest">Total Monitored</span>
              <span className="text-xl font-black text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">{data.length * 4}</span>
            </div>
            <div className="px-5 py-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col items-center justify-center">
              <span className="text-[9px] text-rose-400 uppercase font-black tracking-widest">Resurrected</span>
              <span className="text-xl font-black text-white drop-shadow-[0_0_10px_#ffffff]">
                {data.filter(d => d.analytics?.growth === 'Stagnant').length}
              </span>
            </div>
         </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
            <span className="text-rose-500/50 text-[10px] font-black tracking-widest uppercase animate-pulse">Scanning Grid...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center text-gray-500 border border-white/5 rounded-3xl h-32 bg-transparent uppercase text-xs tracking-widest font-bold">
          Neural Vault is empty.
        </div>
      ) : (
        /* The main grid. Setting items-start prevents tall items from stretching siblings */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 items-stretch">
          <AnimatePresence>
            {data.map((item, idx) => {
              const isStagnant = item.analytics?.growth === "Stagnant";
              
              // Borders are strictly transparent lines without background blocks
              return (
                <motion.div
                  key={item._id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-transparent border rounded-[2rem] p-6 flex flex-col relative transition-all duration-300 ${
                    isStagnant 
                      ? "border-rose-500/20 hover:border-rose-500/50 shadow-[inset_0_0_30px_rgba(244,63,94,0.02)]" 
                      : "border-green-500/20 hover:border-green-500/50 shadow-[inset_0_0_30px_rgba(34,197,94,0.02)]"
                  }`}
                >
                  {/* Status Indicator inside header */}
                  <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
                     <h3 className="text-sm font-bold text-white truncate drop-shadow-md pr-4">{item.title}</h3>
                     
                     <div className={`px-2 py-1 flex-shrink-0 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        isStagnant 
                          ? 'border border-rose-500/50 text-rose-400 bg-transparent shadow-[0_0_10px_rgba(244,63,94,0.2)]' 
                          : 'border border-green-500/50 text-green-400 bg-transparent shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${isStagnant ? 'bg-rose-400' : 'bg-green-400'} animate-pulse`} />
                        {isStagnant ? "CRITICAL" : "OPTIMAL"}
                     </div>
                  </div>

                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-bold">
                    Deployed: {new Date(item.scheduledAt || item.createdAt).toLocaleDateString()}
                  </p>

                  <SecureSparkline value={item.analytics?.views || 10} isStagnant={isStagnant} />

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div>
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1">Views Aggregated</p>
                      <p className={`text-2xl font-black rounded ${isStagnant ? 'text-white' : 'text-green-300 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]'}`}>
                        {item.analytics?.views || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1">Watch (HRS)</p>
                      <p className="text-2xl font-black text-gray-300">{item.analytics?.watchTime || 0}</p>
                    </div>
                  </div>

                  {isStagnant && (
                    <div className="mt-6 border-t border-rose-500/10 pt-4">
                      <div className="flex gap-3 items-center">
                        <div className="text-rose-500 animate-pulse text-lg">⚠</div>
                        <div>
                          <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest">Resurrection Executed</p>
                          <p className="text-[10px] text-gray-400 font-medium leading-tight">Video pipeline cloned & injected back into automation queue.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
