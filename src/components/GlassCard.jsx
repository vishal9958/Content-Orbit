import { motion } from "framer-motion";

export default function GlassCard({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      {children}
    </motion.div>
  );
}