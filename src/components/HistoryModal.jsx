import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios.get("http://localhost:5000/api/schedules/all")
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-md p-6 lg:p-10"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-widest drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              Neural Memory Vault
            </h2>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Comprehensive historical record of scripts, AI generation, and synthetic videos.</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-black transition-all"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
          {loading ? (
            <div className="col-span-full h-40 flex items-center justify-center">
              <div className="flex items-center gap-4">
                 <div className="w-6 h-6 border-2 border-purple-500/50 border-t-purple-500 rounded-full animate-spin" />
                 <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest animate-pulse">Retrieving Memories...</span>
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-40 border border-white/5 bg-white/5 rounded-3xl text-gray-500 uppercase tracking-widest text-[10px] font-black">
              Vault is Empty
            </div>
          ) : (
            history.map((record, i) => (
              <motion.div 
                key={record._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-transparent border border-white/10 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden group hover:border-white/30 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white">{record.title}</h3>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                      {new Date(record.scheduledAt || record.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    record.status === 'completed' ? 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                    record.status === 'LEGACY' ? 'border border-blue-500/30 text-blue-400 bg-blue-500/10' :
                    record.status === 'failed' ? 'border border-red-500/30 text-red-400 bg-red-500/10' :
                    'border border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {record.status}
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex-1">
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Generated Script / Prompt</p>
                  <p className="text-xs text-gray-300 italic whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                    {record.description}
                  </p>
                </div>

                {record.contentId && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest mb-3 flex justify-between">
                      Synthesized Output 🎬
                      {record.repurposed && <span className="text-rose-400">Repurposed</span>}
                    </p>
                    <video 
                      src={`http://localhost:5000/videos/${record.contentId}.mp4`} 
                      controls 
                      className="w-full h-auto max-h-[250px] object-contain rounded-xl bg-black border border-white/5"
                    />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
