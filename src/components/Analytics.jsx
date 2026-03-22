import { motion } from "framer-motion";

export default function Analytics() {
  const stats = [
    { label: "Viral Index", value: "94.8", trend: "+12%", color: "purple" },
    { label: "Hook Retention", value: "82%", trend: "Stable", color: "blue" },
    { label: "Sentiment", value: "Positive", trend: "High", color: "green" },
    { label: "Confusion Rate", value: "0.02%", trend: "-5%", color: "red" }
  ];

  return (
    <div className="p-10 space-y-10 overflow-y-auto h-screen custom-scrollbar">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Intelligence Center</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em]">Real-time Content Lifecycle Audit</p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Syncing</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-[0px] relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-${s.color}-500 opacity-50`} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{s.label}</h3>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">{s.value}</p>
            <span className={`text-[10px] font-bold text-${s.color}-400 uppercase`}>{s.trend}</span>
          </motion.div>
        ))}
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Script Performance Map */}
        <div className="col-span-2 p-8 bg-white/[0.02] border border-white/5 rounded-[40px] h-96 relative">
          <h3 className="text-white font-black uppercase text-sm mb-6">Script Engagement Heatmap</h3>
          <div className="w-full h-48 bg-gradient-to-r from-purple-500/10 via-blue-500/20 to-pink-500/10 rounded-2xl border border-white/5 flex items-center justify-center italic text-gray-600 text-xs">
            Visualizing Script Retention Flow...
          </div>
          <div className="mt-8 flex justify-between text-[10px] font-bold text-gray-500 uppercase">
            <span>Hook (0-5s)</span>
            <span>Body (5-45s)</span>
            <span>CTA (45s+)</span>
          </div>
        </div>

        {/* Optimal Posting Logic */}
        <div className="p-8 bg-gradient-to-b from-purple-600/10 to-transparent border border-white/10 rounded-[40px]">
          <h3 className="text-white font-black uppercase text-sm mb-6">Auto-Post Logic</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-bottom border-white/5">
              <span className="text-gray-500 text-xs font-bold">Optimal Time</span>
              <span className="text-white text-xs font-black uppercase">7:45 PM IST</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-bottom border-white/5">
              <span className="text-gray-500 text-xs font-bold">Best Platform</span>
              <span className="text-white text-xs font-black uppercase">YouTube Reels</span>
            </div>
            <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] rounded-2xl hover:scale-105 transition-all">
              Execute Auto-Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}