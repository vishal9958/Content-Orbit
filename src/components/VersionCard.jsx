export default function VersionCard({ version, onClick, onGenerateVideo, isGenerating, generatingId }) {
  // Check if THIS specific card is currently generating
  const isThisGenerating = isGenerating && generatingId === version.id;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer group transition-all duration-500 h-full flex flex-col ${
        isThisGenerating ? "border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.15)]" : "hover:border-purple-500/30"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
            {version.tone}
          </span>
          {/* Hinglish Badge for Gemini Veo */}
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] text-gray-500 font-bold">
            HI + EN
          </span>
        </div>
        <div className={`h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] transition-opacity ${isThisGenerating ? "opacity-100 animate-pulse" : "opacity-0 group-hover:opacity-100"}`} />
      </div>
      
      {/* Content preview limited to 4 lines - R-Paar Glassy Look */}
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 italic mb-6 flex-grow">
        "{version.content}"
      </p>

      {/* Button Stack */}
      <div className="flex flex-col gap-3">
        <button className="button-secondary w-full text-[9px] uppercase font-bold tracking-widest py-2.5">
          Click to Expand & Refine
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Taaki card click karke modal na khule
            onGenerateVideo(version.content, version.id); // Passing ID for selective loading
          }}
          disabled={isGenerating}
          className={`w-full py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all shadow-lg ${
            isThisGenerating 
            ? "bg-purple-600 text-white animate-pulse cursor-wait" 
            : "bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-indigo-500/10"
          } disabled:opacity-50`}
        >
          {isThisGenerating ? "Synthesizing Video..." : "🎬 Generate AI Video"}
        </button>
      </div>
    </div>
  );
}