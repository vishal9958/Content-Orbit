import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// 📈 Live Graph Component for Intelligence Boxes
const MiniGraph = ({ color }) => (
  <svg className="w-16 h-8 opacity-50" viewBox="0 0 100 40">
    <motion.path
      d="M0 35 Q 20 10, 40 30 T 80 15 T 100 35"
      fill="none"
      stroke={color}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1, d: ["M0 35 Q 20 10, 40 30 T 80 15 T 100 35", "M0 30 Q 25 35, 45 10 T 85 25 T 100 20"] }}
      transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
    />
  </svg>
);

// 📊 Neural Multi-Line Graph with Legends
const MultiLineGraph = () => {
  const lines = [
    { label: "Viral Index", color: "#ec4899", delay: 0, d: "M0 30 Q 20 5, 40 25 T 80 10 T 120 30" }, 
    { label: "Retention", color: "#8b5cf6", delay: 1, d: "M0 25 Q 25 35, 45 15 T 85 25 T 120 10" }, 
    { label: "Neural Pulse", color: "#10b981", delay: 0.5, d: "M0 35 Q 30 20, 50 35 T 90 20 T 120 30" }
  ];

  return (
    <div className="absolute inset-0 flex p-10 gap-10">
      <div className="flex flex-col justify-center gap-4 z-20 border-r border-white/5 pr-8">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: line.color, shadowColor: line.color }} />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">{line.label}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 relative opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 120 40">
          {lines.map((line, i) => (
            <motion.path
              key={i}
              d={line.d}
              fill="none"
              stroke={line.color}
              strokeWidth="0.6"
              animate={{ d: [line.d, "M0 20 Q 20 35, 40 15 T 80 30 T 120 20", line.d] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: line.delay }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default function Global({ user, nodes }) {
  const [realProgress, setRealProgress] = useState({ scripting: 0, synthesis: 0, rendering: 0, dispatch: 0 });

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/global/status");
        if (res.data) {
          setRealProgress(res.data);
          console.log("Real Data Synced 🔥:", res.data);
        }
      } catch (err) {
        console.error("Dashboard Sync Error:", err.message);
      }
    };
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 3000); 
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { id: "01", label: "Scripting", status: realProgress.scripting === 100 ? "Neural Optimized" : "Analyzing", color: "purple", p: realProgress.scripting },
    { id: "02", label: "Synthesis", status: realProgress.synthesis === 100 ? "Ready" : "Hinglish Active", color: "emerald", p: realProgress.synthesis },
    { id: "03", label: "Rendering", status: realProgress.rendering > 0 ? "Veo 4K Engine" : "Waiting", color: "blue", p: realProgress.rendering },
    { id: "04", label: "Dispatch", status: realProgress.dispatch === 100 ? "Published" : "Node Ready", color: "pink", p: realProgress.dispatch }
  ];

  return (
    <div className="p-8 space-y-8 bg-transparent min-h-screen font-sans">
      
      {/* 🌌 1. Connection Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "youtube", label: "YouTube Node", icon: "🔴", connected: nodes?.youtube },
          { id: "linkedin", label: "LinkedIn Node", icon: "🔵", connected: nodes?.linkedin },
          { id: "instagram", label: "Instagram Node", icon: "📸", connected: nodes?.instagram }
        ].map((node) => (
          <motion.div 
            key={node.id}
            whileHover={{ y: -2 }}
            className={`p-6 rounded-[2.5rem] border backdrop-blur-[0px] transition-all relative overflow-hidden ${
              node.connected ? 'bg-white/[0.04] border-emerald-500/30 shadow-2xl' : 'bg-black/20 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-xl bg-white/2">{node.icon}</div>
                <div>
                  <h3 className="text-white font-black uppercase text-[11px] tracking-widest">{node.label}</h3>
                  <p className={`text-[8px] font-bold uppercase ${node.connected ? 'text-emerald-400' : 'text-red-400/80'}`}>
                    {node.connected ? "Neural Link Active" : "Link Standby"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${node.connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse'}`} />
                <span className={`text-[9px] font-black uppercase italic ${node.connected ? 'text-emerald-400' : 'text-red-500'}`}>{node.connected ? "LIVE" : "OFFLINE"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📊 2. Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Viral Index", val: "96.4", color: "#ec4899", glow: "pink" },
          { label: "Retention Rate", val: "74.2%", color: "#8b5cf6", glow: "purple" },
          { label: "Confusion Rate", val: "0.01%", color: "#ef4444", glow: "red" },
          { label: "Neural Fidelity", val: "99.9%", color: "#10b981", glow: "emerald" }
        ].map((stat, i) => (
          <div key={i} className="px-6 py-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-[0px] relative overflow-hidden group shadow-2xl">
            <div className={`absolute -top-10 -right-10 h-32 w-32 bg-${stat.glow}-500/5 blur-[40px]`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">{stat.label}</span>
              <MiniGraph color={stat.color} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic relative z-10">{stat.val}</h2>
            <span className="text-[8px] font-bold text-gray-600 uppercase mt-2 block tracking-widest italic relative z-10">Real-Time Synthesis</span>
          </div>
        ))}
      </div>

      {/* 🛠️ 3. Content Pipeline */}
      <motion.div className="px-10 py-14 rounded-[3.5rem] bg-white/[0.01] border border-white/10 backdrop-blur-[0px] relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-16 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Pipeline</h2>
            <p className="text-[10px] font-bold text-purple-400/80 uppercase tracking-[0.5em] mt-2 italic">Content Lifecycle Engine</p>
          </div>
          <div className="px-5 py-2 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
             Pipeline Active
          </div>
        </div>
        <div className="grid grid-cols-4 gap-12 relative z-10">
          <div className="absolute top-6 left-0 w-full h-[1px] bg-white/5 -z-10" />
          {stages.map((stage, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white/20 italic">{stage.id}</span>
                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-${stage.color}-500 shadow-[0_0_15px] shadow-${stage.color}-500`} />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">{stage.label}</h4>
                <div className="h-1.5 w-28 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5">
                   <motion.div animate={{ width: `${stage.p}%` }} transition={{ duration: 1, ease: "linear" }} className={`h-full bg-gradient-to-r from-${stage.color}-600 to-${stage.color}-400`} />
                </div>
                <p className={`text-[8px] font-black uppercase tracking-widest ${stage.p === 100 ? 'text-emerald-500' : 'text-gray-600 italic'}`}>{stage.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🤖 4. Neural Command Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        <div className="lg:col-span-8 px-10 py-10 rounded-[3rem] bg-black/20 border border-white/10 font-mono relative overflow-hidden shadow-2xl group">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-30">
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500/20" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/20" />
            </div>
            <span className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.4em]">NEURAL_METRICS_MATRIX_V6</span>
          </div>
          <MultiLineGraph />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <button className="flex-1 rounded-[2.5rem] bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all">Force Sync Node</button>
          <button className="flex-1 rounded-[2.5rem] bg-white/[0.05] border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/10 transition-all">Export Lifecycle</button>
          <button className="flex-1 rounded-[2.5rem] bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-600/20 transition-all">Critical Halt</button>
        </div>
      </div>
    </div>
  );
}