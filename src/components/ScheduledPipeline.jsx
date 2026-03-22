import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ScheduledPipeline() {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedules/pending");
      setSchedules(res.data);
    } catch (err) {
      console.error("Pipeline Sync Error");
    }
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Pipeline</h3>
      <h2 className="text-xl font-bold text-white italic">Upcoming Posts</h2>
      
      <div className="space-y-3">
        {schedules.length === 0 ? (
          <p className="text-gray-600 text-xs italic">No posts scheduled yet...</p>
        ) : (
          schedules.map((post) => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center"
            >
              <div>
                <p className="text-white text-[11px] font-bold truncate w-40">{post.title}</p>
                <p className="text-purple-400 text-[9px] font-medium uppercase tracking-tighter">
                  {new Date(post.scheduledAt).toLocaleString()}
                </p>
              </div>
              <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase">
                Pending
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}