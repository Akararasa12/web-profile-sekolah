import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Settings, Save, School, Info, Mail, Phone, MapPin, Globe, Loader2, Image as ImageIcon, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'SMK IT IQRO',
    tagline: 'Mencetak Generasi Unggul dalam Imtak dan Iptek',
    logoUrl: '',
    description: 'Berkarakter Islami, Berprestasi, dan Siap Menghadapi Masa Depan.',
    address: 'Jl. Raya Pendidikan No. 123, Garut, Jawa Barat',
    email: 'info@smkit-iqro.sch.id',
    phone: '(0262) 123456',
    vision: 'Menjadi lembaga pendidikan kejuruan Islam terpadu yang unggul, berkarakter, dan kompetitif di tingkat nasional pada tahun 2030.',
    mission: [
      'Menyelenggarakan pendidikan yang mengintegrasikan nilai-nilai keislaman dalam setiap aspek pembelajaran.',
      'Mengembangkan potensi siswa melalui kurikulum yang adaptif dengan kebutuhan industri.',
      'Membentuk karakter siswa yang disiplin, jujur, dan berakhlakul karimah.'
    ],
    popupActive: false,
    popupImageUrl: '',
    popupTargetLink: ''
  });

  const formatDriveUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/[-\w]{20,}/);
      if (match) return `https://drive.google.com/uc?id=${match[0]}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalSettings = {
        ...settings,
        logoUrl: formatDriveUrl(settings.logoUrl),
        popupImageUrl: formatDriveUrl(settings.popupImageUrl)
      };
      await setDoc(doc(db, 'settings', 'general'), finalSettings);
      setSettings(finalSettings);
      toast.success('Pengaturan berhasil disimpan!');
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="py-20 text-center font-medium text-slate-400">Memuat pengaturan...</div>;

  const handleResetOfficial = async () => {
    if (!window.confirm('Reset semua pengaturan ke data resmi sekolah (sesuai dokumen Profil)?')) return;
    
    const officialSettings = {
      ...settings,
      schoolName: 'SMK ISLAM TERPADU IQRO LELES',
      tagline: 'Mandiri & Berakhlakul Karimah',
      description: 'Mencetak Peserta Didik yang Mandiri, Terampil, Disiplin, Berprestasi, Sehat, dan Berakhlakul Karimah.',
      address: 'Kp. Cicapar Kaler Rt.04 /Rw.01 Desa Leles Kec Leles Kab Garut (44152)',
      email: 'smkit.iqro@gmail.com',
      phone: '085603293062',
      vision: 'MEWUJUDKAN PESERTA DIDIK YANG MANDIRI, TERAMPIL, DISIPLIN, BERPRESTASI, SEHAT, DAN BERAKHLAKUL KARIMAH',
      mission: [
        'Meningkatkan kegiatan produktif sebagai keahlian dasar bagi peserta didik.',
        'Menyediakan sarana prasarana praktek untuk menunjang kegiatan kegiatan produktif bagi peserta didik.',
        'Menciptakan suasana sekolah harmonis, dinamis dengan menekankan penerapan tata tertib sebagai pedoman.',
        'Meningkatkan pembinaan-pembinaan kedisplinan melalui pengetahuan umum kemasyarakatan.',
        'Meningkatkan kualitas peserta didik baik akademik maupun non akademik melalui KBM dan ekstrakurikuler.',
        'Menciptakan lingkungan yang indah, asri, nyaman, bersih utuk menuju sekolah dan warga sekolah sehat.',
        'Meningkatkan pembinaan ekstrakurikuler keolahragaan untuk menunjang Prestasi non akademik.',
        'Meningkatkan kegiatan dan pembinaan akhlaqul karimah melalui keagamaan yang dikolaborasikan dengan pendidikan umum.',
        'Memasukan kegiatan pembinaan keagamaan kedalam kegiatan ekstrakurikuler sekolah.'
      ]
    };

    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), officialSettings);
      setSettings(officialSettings);
      toast.success('Pengaturan berhasil direset ke data resmi!');
    } catch (error) {
      toast.error('Gagal mereset data.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-secondary-600" />
            Pengaturan Sekolah
          </h1>
          <p className="text-slate-500 font-medium">Kelola informasi profil, visi misi, dan kontak sekolah.</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={handleResetOfficial}
            className="flex items-center gap-2 px-6 py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold border-2 border-orange-100 hover:bg-orange-100 transition-all"
          >
            <Bell className="w-5 h-5" />
            Reset ke Data Resmi
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Simpan Semua
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identitas Sekolah */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
            <School className="w-5 h-5 text-primary-500" />
            Identitas Sekolah
          </h3>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Link Logo Sekolah (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={settings.logoUrl}
                  onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 font-medium ml-1">Gunakan link gambar langsung atau link sharing Google Drive.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama Sekolah</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                  value={settings.schoolName}
                  onChange={e => setSettings({...settings, schoolName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tagline Sekolah</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={settings.tagline}
                  onChange={e => setSettings({...settings, tagline: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Deskripsi Singkat</label>
              <textarea 
                rows="3"
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                value={settings.description}
                onChange={e => setSettings({...settings, description: e.target.value})}
              />
            </div>
          </div>
        </motion.div>

        {/* Pengumuman Pop-up */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-500" />
              Pengumuman Pop-up (Lightbox)
            </h3>
            <button 
              type="button"
              onClick={() => setSettings({...settings, popupActive: !settings.popupActive})}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${settings.popupActive ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
            >
              {settings.popupActive ? 'Aktif' : 'Non-aktif'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Link Gambar Pengumuman (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={settings.popupImageUrl}
                  onChange={e => setSettings({...settings, popupImageUrl: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Link Tujuan (Saat diklik)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: /berita/id-artikel"
                  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={settings.popupTargetLink}
                  onChange={e => setSettings({...settings, popupTargetLink: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 font-medium ml-1">Viewer akan diarahkan ke halaman ini saat gambar diklik.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Preview Pop-up</label>
              <div className="aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {settings.popupImageUrl ? (
                  <img src={settings.popupImageUrl} alt="Popup Preview" className="w-full h-full object-cover" />
                ) : (
                  <Bell className="w-8 h-8 text-slate-200" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visi & Misi */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Info className="w-5 h-5 text-secondary-500" />
            Visi & Misi
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Visi Sekolah</label>
              <textarea 
                rows="3"
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                value={settings.vision}
                onChange={e => setSettings({...settings, vision: e.target.value})}
              />
            </div>
            {/* Note: In real app, misi would be an array editor, but for now we'll use a simple textarea split by newline */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Misi Sekolah (Satu per baris)</label>
              <textarea 
                rows="6"
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                value={Array.isArray(settings.mission) ? settings.mission.join('\n') : ''}
                onChange={e => setSettings({...settings, mission: e.target.value.split('\n')})}
              />
            </div>
          </div>
        </motion.div>

        {/* Kontak */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-500" />
            Informasi Kontak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Mail className="w-3 h-3" /> Email</label>
              <input type="email" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Phone className="w-3 h-3" /> Telepon</label>
              <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><MapPin className="w-3 h-3" /> Alamat Lengkap</label>
              <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default AdminSettings;
