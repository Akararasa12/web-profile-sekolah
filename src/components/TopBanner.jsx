import { motion } from 'framer-motion';
import { Github, Code2 } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-10 bg-slate-900 overflow-hidden flex items-center z-[60]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 bg-[length:200%_auto] animate-gradient" />
      
      <div className="container mx-auto px-6 flex items-center justify-center relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-12 whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              <Code2 className="w-3 h-3 text-primary-400" />
              <span>@Created By Alif Nugraha</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-2 text-primary-400">
                <Github className="w-3 h-3" />
                <span>Akararasa12</span>
              </div>
              <span className="ml-12 text-slate-600 opacity-30">|</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}} />
    </div>
  );
};

export default TopBanner;
