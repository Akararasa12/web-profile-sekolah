import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck, Cpu, Users } from 'lucide-react'

const Home = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    '/assets/hero/bg1.webp',
    '/assets/hero/bg2.webp',
    '/assets/hero/bg3.webp'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden bg-slate-900">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto relative z-10 text-left lg:px-20"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-xs font-bold mb-10 backdrop-blur-md shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Terakreditasi A & Berstandar Industri
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-[1.1]">
            SMK Islam Terpadu <br />
            <span className="text-primary-500">Iqro Leles</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-medium">
            Mencetak Peserta Didik yang Mandiri, Terampil, Disiplin, Berprestasi, Sehat, dan Berakhlakul Karimah.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <motion.a
              href="/ppdb"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-primary-600/30 transition-all text-lg"
            >
              Daftar Sekarang (PPDB)
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="/profil"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 backdrop-blur-md transition-all text-lg"
            >
              Kenali Kami
            </motion.a>
          </div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBg(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${currentBg === i ? 'w-10 bg-primary-500' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Program Keahlian Section */}
      <section className="py-32 bg-slate-50/50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
            >
              Program Keahlian
            </motion.h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
              Kurikulum berbasis industri yang dirancang untuk membekali siswa dengan keahlian spesifik dan relevan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* TKJ */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-primary-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-primary-600 transition-colors mx-auto">
                <Cpu className="w-10 h-10 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Teknik Komputer dan Jaringan</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Mempelajari instalasi jaringan LAN, WAN, administrasi server, serta keamanan infrastruktur IT berstandar global.
              </p>
            </motion.div>

            {/* OTKP */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-secondary-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-secondary-600 transition-colors mx-auto">
                <Users className="w-10 h-10 text-secondary-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Otomatisasi dan Tata Kelola Perkantoran</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Fokus pada manajemen kearsipan, korespondensi bisnis, teknologi perkantoran modern, dan layanan prima.
              </p>
            </motion.div>

            {/* ATPH */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-green-600 transition-colors mx-auto">
                <div className="text-green-600 group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6.4 8-12a1 1 0 0 0-1-1c-5.6 0-9.5 2.5-12 8a1 1 0 0 0 1 1c0-5.6 2.5-9.5 8-12"/><path d="M14 20c-5.5-2.5-8-6.4-8-12a1 1 0 0 1 1-1c5.6 0 9.5 2.5 12 8a1 1 0 0 1-1 1c0-5.6-2.5-9.5-8-12"/></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Agribisnis Tanaman Pangan dan Hortikultura</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Menguasai teknologi budidaya tanaman, manajemen agribisnis, serta inovasi pertanian berkelanjutan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
