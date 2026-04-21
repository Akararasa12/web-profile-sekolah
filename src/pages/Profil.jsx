import { motion } from 'framer-motion';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const Profil = () => {
  const missions = [
    "Meningkatkan kegiatan produktif sebagai keahlian dasar bagi peserta didik.",
    "Menyediakan sarana prasarana praktek untuk menunjang kegiatan kegiatan produktif bagi peserta didik.",
    "Menciptakan suasana sekolah harmonis, dinamis dengan menekankan penerapan tata tertib sebagai pedoman.",
    "Meningkatkan pembinaan-pembinaan kedisiplinan melalui pengetahuan umum kemasyarakatan.",
    "Meningkatkan kualitas peserta didik baik akademik maupun non akademik melalui KBM dan ekstrakurikuler.",
    "Menciptakan lingkungan yang indah, asri, nyaman, bersih utuk menuju sekolah dan warga sekolah sehat.",
    "Meningkatkan pembinaan ekstrakurikuler keolahragaan untuk menunjang Prestasi non akademik.",
    "Meningkatkan kegiatan dan pembinaan akhlaqul karimah melalui keagamaan yang dikolaborasikan dengan pendidikan umum.",
    "Memasukan kegiatan pembinaan keagamaan kedalam kegiatan ekstrakurikuler sekolah."
  ];

  const identitas = [
    { label: 'NPSN', value: '69882346' },
    { label: 'Status', value: 'Swasta' },
    { label: 'Akreditasi', value: 'A' },
    { label: 'Alamat', value: 'Kp. Cicapar Kaler Rt.04 /Rw.01 Desa Leles Kec Leles Kab Garut (44152)' },
    { label: 'Telepon', value: '085603293062' },
    { label: 'Email', value: 'smkit.iqro@gmail.com' }
  ];

  const struktur = [
    { role: 'Kepala Sekolah', name: 'Alan Muhtar, S.Pd.I.,M.Pd.' },
    { role: 'Wakasek Kurikulum', name: 'Imas Masliah, S.P.' },
    { role: 'Wakasek Kesiswaan', name: 'Yani Suryani, S.Pt.' },
    { role: 'Ketua Program TKJ', name: 'Nurlaelasari M, S.Kom' },
    { role: 'Ketua Program OTKP', name: 'Imam Mansyur, S.E' }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50">
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
            Mengenal lebih dekat visi, misi, dan identitas resmi SMK ISLAM TERPADU IQRO LELES.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-secondary-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
              <Eye className="w-10 h-10 text-secondary-600" />
            </div>
            <h2 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Visi Kami</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-semibold italic">
              "MEWUJUDKAN PESERTA DIDIK YANG MANDIRI, TERAMPIL, DISIPLIN, BERPRESTASI, SEHAT, DAN BERAKHLAKUL KARIMAH"
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <Target className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Misi Kami</h2>
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              {missions.map((mission, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">{mission}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Identitas Sekolah */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Identitas Sekolah</h2>
            <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {identitas.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/40 text-center flex flex-col items-center justify-center"
              >
                <p className="text-xs font-black uppercase tracking-widest text-primary-600 mb-2">{item.label}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Struktur Organisasi</h2>
            <div className="w-24 h-1.5 bg-secondary-600 mx-auto rounded-full" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {struktur.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-sm p-8 bg-white border-b-4 border-secondary-600 rounded-[2.5rem] shadow-xl text-center"
              >
                <p className="text-xs font-black uppercase tracking-widest text-secondary-600 mb-4">{person.role}</p>
                <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-black mb-4 text-primary-500">61</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Siswa Aktif</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-4 text-secondary-500">17</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Guru Pengajar</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-4 text-emerald-500">3</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Program Keahlian</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
