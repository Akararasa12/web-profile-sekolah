import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, BookOpen, GraduationCap, CheckCircle, School } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PPDB = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    previousSchool: '',
    selectedMajor: 'TKJ',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format Phone Number (convert 08 to 628)
      let formattedPhone = formData.phone.replace(/[^0-9]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.substring(1);
      }

      // Generate Custom Registration ID: MAJOR-DDMMYYYY-SHORTID
      const now = new Date();
      const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}`;
      const uniquePart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const regId = `${formData.selectedMajor}-${datePart}-${uniquePart}`;

      await addDoc(collection(db, 'registrations'), {
        ...formData,
        phone: formattedPhone,
        registrationId: regId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100"
        >
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-slate-500 font-medium mb-10">Terima kasih telah mendaftar di SMK IT IQRO. Tim kami akan segera menghubungi Anda melalui WhatsApp atau Email.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-secondary-600 text-white rounded-2xl font-bold shadow-lg shadow-secondary-600/20"
          >
            Daftar Siswa Lain
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight"
            >
              Pendaftaran Siswa Baru <br />
              <span className="text-primary-600">T.A 2026/2027</span>
            </motion.h1>
            <p className="text-xl text-slate-500 mb-10 font-medium leading-relaxed">
              Bergabunglah bersama kami dan wujudkan cita-citamu di sekolah kejuruan terbaik dengan standar industri.
            </p>

            <div className="space-y-6">
              {[
                { title: "Kurikulum Industri", desc: "Materi belajar yang selalu update dengan kebutuhan pasar kerja." },
                { title: "Fasilitas Modern", desc: "Laboratorium dengan teknologi terkini untuk menunjang praktik." },
                { title: "Penempatan Kerja", desc: "Bekerjasama dengan puluhan perusahaan mitra untuk penyaluran lulusan." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Formulir Pendaftaran</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama sesuai ijazah"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">No. WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="0812..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Asal Sekolah</label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="SMP/MTs Asal"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Pilihan Jurusan</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-700 appearance-none"
                    value={formData.selectedMajor}
                    onChange={(e) => setFormData({ ...formData, selectedMajor: e.target.value })}
                  >
                    <option value="TKJ">Teknik Komputer & Jaringan (TKJ)</option>
                    <option value="OTKP">Otomatisasi dan Tata Kelola Perkantoran (OTKP)</option>
                    <option value="ATPH">Agribisnis Tanaman Pangan dan Hortikultura (ATPH)</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary-600/30 transition-all text-lg disabled:opacity-50"
              >
                {loading ? "Mengirim Data..." : (
                  <>
                    Kirim Pendaftaran
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PPDB;
