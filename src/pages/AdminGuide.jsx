import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, AlertCircle, Image as ImageIcon, Users, Newspaper, ShieldCheck, Settings, Bell, ExternalLink } from 'lucide-react';

const AdminGuide = () => {
  const guides = [
    {
      title: "Manajemen Berita",
      icon: <Newspaper className="w-6 h-6 text-primary-600" />,
      steps: [
        "Klik menu 'Kelola Berita' di sidebar.",
        "Gunakan editor teks untuk mengatur format tulisan (Bold, Italic, List).",
        "Anda bisa menyisipkan gambar langsung di dalam isi berita.",
        "Jika upload gambar gagal, gunakan link foto dari internet (misal: PostImages)."
      ]
    },
    {
      title: "Kelola Galeri",
      icon: <ImageIcon className="w-6 h-6 text-indigo-600" />,
      steps: [
        "Upload foto kegiatan, fasilitas, atau prestasi di menu 'Kelola Galeri'.",
        "Pilih kategori yang sesuai agar foto muncul di filter yang benar pada halaman publik.",
        "Gunakan caption singkat untuk menjelaskan isi foto."
      ]
    },
    {
      title: "Pengaturan & Identitas",
      icon: <Settings className="w-6 h-6 text-slate-600" />,
      steps: [
        "Ubah Nama Sekolah, Tagline, dan Logo di menu 'Pengaturan'.",
        "Update Visi & Misi dan informasi kontak (Email, Telp, Alamat) di sini.",
        "Perubahan di sini akan langsung berdampak ke Navbar dan Footer seluruh website."
      ]
    },
    {
      title: "Pop-up Pengumuman",
      icon: <Bell className="w-6 h-6 text-amber-600" />,
      steps: [
        "Aktifkan 'Pop-up Pengumuman' di menu Pengaturan untuk info mendesak.",
        "Masukkan Link Gambar (URL) dan Link Tujuan (misal: link pendaftaran atau link berita).",
        "Pop-up hanya muncul sekali per sesi browser agar tidak mengganggu pengunjung."
      ]
    },
    {
      title: "Tips Hosting Gambar (Google Drive)",
      icon: <ExternalLink className="w-6 h-6 text-blue-600" />,
      steps: [
        "Pastikan file di Google Drive diatur ke 'Anyone with the link' (Siapa saja yang memiliki link).",
        "Copy link sharing-nya dan tempelkan ke kolom URL di admin.",
        "Sistem kami akan otomatis mengubahnya menjadi link gambar langsung.",
        "Jika masih tidak muncul, gunakan alternatif [PostImages.org] untuk Direct Link."
      ]
    },
    {
      title: "Data Guru & PPDB",
      icon: <Users className="w-6 h-6 text-secondary-600" />,
      steps: [
        "Kelola data guru dan pantau pendaftar baru secara berkala.",
        "Gunakan tombol WhatsApp untuk menghubungi pendaftar PPDB langsung dari dashboard."
      ]
    }
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary-600" />
          Panduan Admin
        </h1>
        <p className="text-slate-500 font-medium">Pelajari cara mengelola website SMK IT IQRO dengan benar.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {guides.map((guide, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                {guide.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{guide.title}</h3>
            </div>
            <ul className="space-y-4">
              {guide.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    {sIdx + 1}
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-amber-900 mb-2">Tips Keamanan</h4>
            <p className="text-amber-800/70 font-medium leading-relaxed">
              Jangan lupa untuk selalu **Logout** setelah selesai mengelola website, terutama jika Anda menggunakan komputer publik. Pastikan password Anda kuat dan tidak dibagikan kepada orang lain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuide;
