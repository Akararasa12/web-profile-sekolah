import { motion } from 'framer-motion';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const Profil = () => {
  const missions = [
    "Menyelenggarakan pendidikan kejuruan yang berkualitas dan relevan dengan kebutuhan industri.",
    "Membentuk karakter siswa yang religius, jujur, disiplin, dan bertanggung jawab.",
    "Mengembangkan potensi siswa melalui kegiatan ekstrakurikuler dan organisasi.",
    "Menjalin kerjasama yang erat dengan dunia usaha dan dunia industri (DUDI).",
    "Melahirkan lulusan yang siap kerja, mandiri, dan mampu bersaing di tingkat global."
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Profil Sekolah
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Mengenal lebih dekat visi, misi, dan nilai-nilai yang kami pegang teguh di SMK IT IQRO.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50"
          >
            <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mb-8">
              <Eye className="w-8 h-8 text-secondary-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Visi Kami</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              "Menjadi lembaga pendidikan kejuruan Islam terpadu yang unggul, menghasilkan lulusan berakhlak mulia, kompeten secara profesional, dan inovatif di era digital."
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50"
          >
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Misi Kami</h2>
            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <p className="text-slate-600 font-medium">{mission}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="bg-secondary-600 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-black mb-4">10+</div>
              <div className="text-secondary-100 font-bold uppercase tracking-widest text-sm">Tahun Berdiri</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-4">500+</div>
              <div className="text-secondary-100 font-bold uppercase tracking-widest text-sm">Alumni Sukses</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-4">20+</div>
              <div className="text-secondary-100 font-bold uppercase tracking-widest text-sm">Mitra Industri</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
