import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Mail, Phone, Calendar, Search, Download, Printer, Eye, X, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplicants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data pendaftar ini?')) {
      try {
        await deleteDoc(doc(db, 'registrations', id));
        toast.success('Data pendaftar berhasil dihapus');
      } catch (error) { toast.error('Gagal menghapus data'); }
    }
  };

  const downloadCSV = () => {
    const headers = ['No. Registrasi', 'Nama Lengkap', 'Email', 'Telepon', 'Asal Sekolah', 'Jurusan', 'Tanggal Daftar'];
    const rows = filteredApplicants.map(app => [
      app.registrationId || app.id,
      app.fullName,
      app.email,
      app.phone,
      app.previousSchool,
      app.selectedMajor,
      app.createdAt?.toDate().toLocaleDateString('id-ID')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_PPDB_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data berhasil diunduh (Excel/CSV)');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredApplicants = applicants.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.previousSchool.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Pendaftar PPDB</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Total {applicants.length} Calon Siswa Baru Terdaftar
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama atau sekolah..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download className="w-5 h-5" />
              Ekspor
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
            >
              <Printer className="w-5 h-5" />
              Cetak
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Siswa & Kontak</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sekolah Asal</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jurusan</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terdaftar</th>
                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                          <User className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-medium">Tidak ada data pendaftar.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app) => (
                    <motion.tr 
                      key={app.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-primary-50/30 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-primary-600 font-black shadow-sm group-hover:shadow-md transition-all">
                            {app.fullName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{app.fullName}</span>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider"><Phone className="w-3 h-3" /> {app.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600 text-sm">
                        {app.previousSchool}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black tracking-widest shadow-sm ${
                          app.selectedMajor === 'TKJ' ? 'bg-blue-50 text-blue-600' :
                          app.selectedMajor === 'OTKP' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {app.selectedMajor}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-400 font-bold">
                        {app.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"
                            title="Lihat Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(app.id)}
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Detail Pendaftar</h2>
                      <p className="text-slate-500 font-medium text-sm">No. Reg: {selectedApp.registrationId || selectedApp.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Nama Lengkap</label>
                      <p className="text-xl font-bold text-slate-900">{selectedApp.fullName}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Asal Sekolah</label>
                      <p className="text-xl font-bold text-slate-900">{selectedApp.previousSchool}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Pilihan Jurusan</label>
                      <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-black tracking-widest uppercase">{selectedApp.selectedMajor}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Nomor WhatsApp</label>
                      <p className="text-xl font-bold text-slate-900">+{selectedApp.phone}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Alamat Email</label>
                      <p className="text-lg font-bold text-slate-600">{selectedApp.email}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Tanggal Pendaftaran</label>
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        {selectedApp.createdAt?.toDate().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-emerald-50 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-emerald-900 font-black text-lg uppercase tracking-tight">Status Verifikasi</p>
                      <p className="text-emerald-600 font-bold text-sm">Pendaftaran Telah Diterima</p>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/${selectedApp.phone}`}
                    target="_blank"
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Hubungi Calon Siswa
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminApplicants;
