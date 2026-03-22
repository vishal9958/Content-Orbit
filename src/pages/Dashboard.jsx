import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../layout/Sidebar";
import CreatePanel from "../components/CreatePanel";
import InsightsPanel from "../components/InsightsPanel";
import Analytics from "../components/Analytics";
import Global from "./Global";
import ScheduledPipeline from "../components/ScheduledPipeline";
import SettingsPanel from "../components/SettingsPanel";
import HistoryModal from "../components/HistoryModal";
// Firebase imports
import { auth, provider, signInWithPopup } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

export default function Dashboard() {
  // Real User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔌 Connection State for Nodes
  const [nodes, setNodes] = useState({ youtube: false, linkedin: false });
  const [activeTab, setActiveTab] = useState("AI Workspace");
  const [showHistory, setShowHistory] = useState(false);

  // 🔥 Safety Fix: Diagnostic State (Page crash se bachane ke liye)
  const [alertInfo, setAlertInfo] = useState({
    type: "CRITICAL ANOMALY",
    message: "System detected misinterpretation in the latest LinkedIn thread. AI suggesting corrective clarification post.",
    icon: "⚠"
  });

  // Check if user is already logged in & Fetch Node Status
  useEffect(() => {
    // 🔥 Guaranteed explicit polling to ensure node status syncs correctly:
    fetchNodeStatus(); 
    const nodeInterval = setInterval(fetchNodeStatus, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          googleId: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          photo: currentUser.photoURL,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
       unsubscribe();
       clearInterval(nodeInterval);
    };
  }, []);

  const fetchNodeStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/connection-status");
      setNodes(res.data);
    } catch (err) {
      console.error("Node status fetch failed", err);
    }
  };

  // 🔥 Safety Fix: Function to trigger AI healing
  const handleAutoCorrect = async () => {
    try {
      await axios.post("http://localhost:5000/api/auto-correct", {
        videoId: "LIVE_NODE_01",
        issueType: alertInfo.type
      });
      alert("Self-Healing Cycle Initiated! AI is pushing correction.");
    } catch (err) {
      console.error("Auto-correct failed", err);
    }
  };
  // Dashboard ya CreatePanel mein jahan button hai
const generateVideo = async (script, id) => {
  try {
    // 1. UI update
    setLoadingVideo(true); 
    
    // 2. Backend call
    const res = await axios.post("http://localhost:5000/api/video/gemini-veo", {
      prompt: script,
      id: id,
      language: "Hinglish"
    });

    if (res.data.success) {
      // 3. Video URL ko state mein save kar taaki player dikhe
      setVideoPath(res.data.videoUrl); 
      console.log("🔥 Video Ready:", res.data.videoUrl);
    }
  } catch (err) {
    console.error("Video error", err);
  } finally {
    setLoadingVideo(false);
  }
};

  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
      setUser(null);
      setNodes({ youtube: false, linkedin: false });
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const realUser = {
        googleId: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      setUser(realUser);
      await axios.post("http://localhost:5000/api/auth/google", realUser);
      fetchNodeStatus();
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent">
      {/* 🛠️ Sidebar with props navigation fix */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Top Header - Glass Blur */}
        <header className="flex justify-between items-center border-b backdrop-blur-[0px] sticky top-0 z-50 overflow-hidden bg-white/5 border border-white/10 p-10 glass-glow shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">ContentOrbit</h1>
            <p className="text-[10px] text-purple-400 font-black tracking-[0.3em] uppercase mt-1">{activeTab}</p>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 hover:bg-white/10 transition uppercase tracking-widest"
            >
              History
            </button>

            <div onClick={handleAuth} className="relative cursor-pointer group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                {user ? (
                  <img src={user.photo} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black text-white uppercase">Login</span>
                )}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#030303] shadow-lg ${user ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* 🚀 1. DASHBOARD (GLOBAL) TAB */}
          {activeTab === "Dashboard" && (
            <motion.div 
              key="global"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-transparent"
            >
              <Global user={user} nodes={nodes} />
            </motion.div>
          )}

          {/* 🛠️ 2. AI WORKSPACE TAB */}
          {activeTab === "AI Workspace" && (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 grid grid-cols-12 gap-8 bg-transparent"
            >
              {/* Main Column */}
              <div className="col-span-12 lg:col-span-8 space-y-8 bg-transparent">
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 glass-glow shadow-2xl"
                >
                  <CreatePanel user={user} />
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 glass-glow shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-2xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
                        {alertInfo.icon}
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Diagnostic Engine</h3>
                        <h2 className="text-xl font-bold text-white uppercase italic">After-Death Alert</h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <p className="text-gray-300 text-sm font-medium leading-relaxed italic">
                      "{alertInfo.message}"
                    </p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleAutoCorrect}
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-red-600/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                      >
                        🚀 Execute Self-Healing Correction
                      </button>
                      <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 text-[10px] font-bold uppercase transition-all">
                        Dismiss Diagnostic
                      </button>
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* Insights Sidebar Column */}
              <div className="col-span-12 lg:col-span-4 space-y-8 bg-transparent">
                <motion.section 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-[2.5rem] bg-transparent border border-white/10 p-8 shadow-2xl backdrop-blur-[0px]"
                >
                  <InsightsPanel user={user} />
                  <ScheduledPipeline />
                </motion.section>
                
                <div className={`rounded-3xl border p-6 flex items-center justify-between transition-all duration-500 backdrop-blur-[0px] ${nodes.youtube ? "bg-emerald-500/10 border-emerald-500/40" : "bg-red-500/10 border-red-500/30"}`}>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${nodes.youtube ? "text-emerald-400" : "text-red-400"}`}>
                      {nodes.youtube ? "System Node Status" : "Node Disconnected"}
                    </p>
                    <h4 className="text-white font-medium mt-1">
                      {nodes.youtube ? "YouTube Synchronized" : "YouTube Offline"}
                    </h4>
                  </div>
                  <div className={`h-3 w-3 rounded-full animate-pulse ${nodes.youtube ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                </div>
              </div>
            </motion.div>
          )}

          {/* 📊 3. ANALYTICS TAB */}
          {activeTab === "Analytics" && (
            <motion.div 
              key="analytics" 
              className="bg-transparent" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Analytics />
            </motion.div>
          )}

          {/* 🛰️ 4. DEATH ANALYZER TAB */}
          {activeTab === "Death Analyzer" && (
            <motion.div 
              key="settings" 
              className="bg-transparent h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modal for History/Memory vault */}
        <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      </div>
    </div>
  );
}