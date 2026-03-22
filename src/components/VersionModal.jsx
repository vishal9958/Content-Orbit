import { motion } from "framer-motion";

export default function VersionModal({ version, onClose, onSelect }) {
  if (!version) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop blur effect */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {version.tone} <span className="text-purple-500 text-sm ml-2">Manuscript</span>
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition">✕</button>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar text-gray-300 leading-relaxed whitespace-pre-wrap">
            {version.content}
          </div>

          <div className="flex gap-4">
            <button 
                onClick={() => { onSelect(version.id); onClose(); }}
                className="button-primary flex-1 py-4"
            >
              Select & Finalize
            </button>
            <button className="button-secondary px-8 py-4">
              Refine AI
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}