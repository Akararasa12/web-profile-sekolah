import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Mail, Phone, Calendar, Search, Filter } from 'lucide-react';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplicants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data pendaftar ini?')) {
      try {
        await deleteDoc(doc(db, 'registrations', id));
      } catch (error) {
        console.error("Error deleting applicant:", error);
      }
    }
  };

  const filteredApplicants = applicants.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.previousSchool.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Pendaftar PPDB</h1>
          <p className="text-slate-500 font-medium">Kelola data calon siswa baru yang mendaftar online.</p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama atau asal sekolah..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Siswa</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Asal Sekolah</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Pilihan Jurusan</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal Daftar</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">
                      Tidak ada data pendaftar ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app) => (
                    <motion.tr 
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold">
                            {app.fullName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{app.fullName}</span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Mail className="w-3 h-3" /> {app.email}</span>
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Phone className="w-3 h-3" /> {app.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-medium text-slate-600 text-sm">
                        {app.previousSchool}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                          app.selectedMajor === 'TKJ' ? 'bg-blue-50 text-blue-600' :
                          app.selectedMajor === 'RPL' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {app.selectedMajor}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                        {app.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicants;
