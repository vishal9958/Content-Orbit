import { motion } from "framer-motion";

export default function Sidebar({ activeTab, setActiveTab }) { // Props add kiye
  const menuItems = ["Dashboard", "AI Workspace", "Analytics", "Death Analyzer"];
  
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-screen backdrop-blur-[0px] bg-white/[0.02] border-r border-white/10 p-8 flex flex-col z-50"
    >
      <div className="mb-12 flex justify-center">
        <img src="/logo.png" alt="AICORE Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <div 
            key={item} 
            onClick={() => setActiveTab(item)} // Click handler set kiya
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
              activeTab === item 
              ? 'bg-white/10 text-white border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <span className="text-sm font-bold tracking-wide uppercase">{item}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-[0px]">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]" />
          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">System Live</span>
        </div>
      </div>
    </motion.div>
  );
}