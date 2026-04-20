import { motion } from 'framer-motion';

const SideWatermark = () => {
  return (
    <>
      {/* Left Vertical Watermark */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] hidden lg:block pointer-events-none">
        <div className="flex items-center gap-4 -rotate-90 origin-left opacity-40">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-600 whitespace-nowrap">
            @Created By Alif Nugraha
          </span>
          <div className="w-12 h-[1px] bg-primary-400" />
        </div>
      </div>

      {/* Right Vertical Watermark */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] hidden lg:block pointer-events-none">
        <div className="flex items-center gap-4 rotate-90 origin-right opacity-40">
          <div className="w-12 h-[1px] bg-primary-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-600 whitespace-nowrap">
            Akararasa12 • Github
          </span>
        </div>
      </div>
    </>
  );
};

export default SideWatermark;
