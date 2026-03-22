import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";
import VersionModal from "./VersionModal"; 

export default function CreatePanel() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedForModal, setSelectedForModal] = useState(null);
  
  const [generatingVideoId, setGeneratingVideoId] = useState(null);
  const [isScheduling, setIsScheduling] = useState(null);
  const [isLegacySaving, setIsLegacySaving] = useState(null);

  const handleGenerate = async () => {
    if (!idea) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/generate`, { idea });
      setVersions(res.data.versions);
    } catch (err) {
      console.error(err);
      alert("Generation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFinal = (id) => {
    setSelectedId(id);
    console.log("Finalized Version ID:", id);
  };

  // 🚀 DB Scheduling Logic
  const handleScheduleRequest = async (content, versionId) => {
    const time = prompt("Enter Schedule Time (YYYY-MM-DD HH:MM:SS):", "2026-03-12 10:00:00");
    if (!time) return;
    setIsScheduling(versionId);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/schedule-db`, {
        id: versionId,
        title: `AI Post - ${versionId.substring(0, 5)}`,
        description: content,
        scheduleTime: time
      });
      if (res.data.success) alert(res.data.message);
    } catch (err) {
      alert("Scheduling failed!");
    } finally {
      setIsScheduling(null);
    }
  };

  // 🕊️ NEW: Legacy Vault Logic (After Death)
  const handleLegacyRequest = async (content, versionId) => {
    if (!confirm("Move this to Legacy Vault? It will be posted if system detects inactivity.")) return;
    setIsLegacySaving(versionId);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/schedule-db`, {
        id: versionId,
        title: `LEGACY: ${idea.substring(0, 20)}`,
        description: content,
        status: "LEGACY" // Model ke enum se match karega
      });
      if (res.data.success) alert("Moved to Legacy Vault. System monitoring active 🕊️");
    } catch (err) {
      alert("Vault sync failed!");
    } finally {
      setIsLegacySaving(null);
    }
  };

  const handleVideoRequest = async (scriptContent, versionId) => {
    if (generatingVideoId) return; 
    setGeneratingVideoId(versionId); 
    try {
      const res = await axios.post(`${API_BASE_URL}/api/video/gemini-veo`, { 
        prompt: scriptContent,
        id: versionId, 
        language: "Hinglish"
      }, { timeout: 300000 });
      if (res.data.success) {
        setVersions(prev => prev.map((v, i) => (v._id || v.id || i) === versionId ? { ...v, videoUrl: res.data.videoUrl } : v));
        alert("✅ Video Ready!");
      }
    } catch (err) {
      alert("Neural Engine Busy!");
    } finally {
      setGeneratingVideoId(null); 
      setSelectedForModal(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="search-bar flex items-center gap-4 px-6 py-2"> 
        <input value={idea} onChange={(e) => setIdea(e.target.value)} className="flex-1 bg-transparent text-white outline-none py-3 text-lg" placeholder="Describe your content vision..." />
        <button onClick={handleGenerate} disabled={loading} className="button-primary h-12 flex items-center justify-center">
          {loading ? "Synthesizing..." : "Generate"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {versions.map((v, idx) => {
            const currentId = v._id || v.id || idx;
            return (
            <motion.div key={currentId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setSelectedForModal(v)} className={`card cursor-pointer group flex flex-col h-full ${selectedId === currentId ? "border-purple-500" : ""}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase text-purple-400">{v.tone}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 italic line-clamp-4 flex-grow">"{v.content}"</p>

              {v.videoUrl && (
                <div className="mb-4 p-3 bg-black/50 border border-purple-500/30 rounded-lg text-xs text-purple-200 overflow-y-auto max-h-48 custom-scrollbar">
                  <p className="text-[9px] font-bold text-gray-500 mb-2">SYNTHESIZED VIEW</p>
                  {v.videoUrl.includes(".mp4") ? (
                    <video src={v.videoUrl} controls autoPlay muted className="w-full rounded bg-black/20 object-cover" />
                  ) : (
                    <p>{v.videoUrl}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleScheduleRequest(v.content, currentId); }} className="button-secondary text-[8px] font-bold py-2 border border-white/10 rounded-lg uppercase">
                    {isScheduling === currentId ? "Wait..." : "📅 Schedule"}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleLegacyRequest(v.content, currentId); }} className="button-secondary text-[8px] font-bold py-2 border border-rose-500/20 text-rose-400 rounded-lg uppercase hover:bg-rose-500/10">
                    {isLegacySaving === currentId ? "Saving..." : "🕊️ Legacy"}
                  </button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleVideoRequest(v.content, currentId); }} disabled={generatingVideoId !== null} className="button-primary w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-[9px] uppercase">
                  {generatingVideoId === currentId ? "Synthesizing Video..." : "🎬 Generate AI Video"}
                </button>
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>

      <VersionModal version={selectedForModal} onClose={() => setSelectedForModal(null)} onSelect={handleSelectFinal} onGenerateVideo={(content) => handleVideoRequest(content, selectedForModal?.id)} isGenerating={generatingVideoId !== null} />
    </div>
  );
}