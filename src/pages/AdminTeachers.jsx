import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload, User, Award, BookOpen, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    subject: '',
    phone: '',
    email: '',
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'teachers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        setFormData({ ...formData, image: compressedFile });
      } catch (error) { console.error(error); }
      setUploading(false);
    }
  };

  const formatDriveUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/[-\w]{20,}/);
      if (match) return `https://drive.google.com/uc?id=${match[0]}`;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = formatDriveUrl(formData.imageUrl);
      if (formData.image) {
        const storageRef = ref(storage, `teachers/${Date.now()}_${formData.image.name}`);
        const uploadTask = await uploadBytes(storageRef, formData.image);
        finalImageUrl = await getDownloadURL(uploadTask.ref);
      }

      const teacherData = {
        name: formData.name,
        position: formData.position,
        subject: formData.subject,
        phone: formData.phone,
        email: formData.email,
        imageUrl: finalImageUrl,
        updatedAt: new Date()
      };

      if (currentTeacher) {
        await updateDoc(doc(db, 'teachers', currentTeacher.id), teacherData);
        toast.success('Data guru berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'teachers'), { ...teacherData, createdAt: new Date() });
        toast.success('Guru baru berhasil ditambahkan!');
      }
      handleCloseModal();
    } catch (error) { toast.error("Gagal menyimpan data guru."); }
    setUploading(false);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Hapus data ${teacher.name}?`)) {
      await deleteDoc(doc(db, 'teachers', teacher.id));
      if (teacher.imageUrl) await deleteObject(ref(storage, teacher.imageUrl)).catch(() => {});
    }
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      position: teacher.position,
      subject: teacher.subject,
      phone: teacher.phone || '',
      email: teacher.email || '',
      imageUrl: teacher.imageUrl,
      image: null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeacher(null);
    setFormData({ name: '', position: '', subject: '', phone: '', email: '', image: null, imageUrl: '' });
  };

  const handleSync = async () => {
    if (teachers.length > 0) {
      if (!window.confirm('Sudah ada data guru di database. Tetap sinkronkan data baru dari dokumen?')) return;
    }
    
    setLoading(true);
    const teacherData = [
      { name: "Alan Muhtar, S.Pd.I.,M.Pd.", position: "Kepala Sekolah", subject: "Manajemen Sekolah", gender: 'male' },
      { name: "Imas Masliah, S.P.", position: "Wakasek Kurikulum", subject: "Produktif ATPH", gender: 'female' },
      { name: "Yani Suryani, S.Pt.", position: "Wakasek Kesiswaan", subject: "Produktif ATPH", gender: 'female' },
      { name: "Riza Elisiana, S.Kom.,M.M", position: "Guru", subject: "INFORMATIKA & CODING", gender: 'female' },
      { name: "M Nuru Iman, S.P", position: "Guru", subject: "Produktif ATPH, Sejarah Indonesia", gender: 'male' },
      { name: "Siti Fatimah, S.Pd.", position: "Guru", subject: "Bahasa Inggris", gender: 'female' },
      { name: "Ayi Permana, S.T.", position: "Guru", subject: "Produktif TKJ", gender: 'male' },
      { name: "Ani Kusumawati, S.Kom", position: "Guru", subject: "Produktif TKJ", gender: 'female' },
      { name: "Nurlaelasari M, S.Kom.", position: "Guru", subject: "Produktif TKJ", gender: 'female' },
      { name: "Kevin Junia Rizqi, S.Tr.T.", position: "Guru", subject: "Produktif TKJ", gender: 'male' },
      { name: "Reni, S.Pd", position: "Guru", subject: "Matematika", gender: 'female' },
      { name: "Muzaki Abdul Syukur, S.Pd", position: "Guru", subject: "PAI", gender: 'male' },
      { name: "Imam Mansyur, S.Pd.", position: "Guru", subject: "Produktif OTKP", gender: 'male' },
      { name: "Emma Amalia, S.Pd., M.T.", position: "Guru", subject: "Pendidikan Kewarganegaraan", gender: 'female' },
      { name: "Hilmi Taftajani, S.Pd", position: "Guru", subject: "Tahfidz", gender: 'male' },
      { name: "Rahma Puri, S.Pd", position: "Guru", subject: "IPAS", gender: 'female' },
      { name: "Hadi Nurkholiq, S.M", position: "Guru", subject: "Produktif OTKP", gender: 'male' },
      { name: "Ema Rahayu F, M.Pd", position: "Guru", subject: "Bahasa Indo & SBK", gender: 'female' }
    ];

    try {
      for (const t of teacherData) {
        const imageUrl = t.gender === 'male' 
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}&backgroundColor=e2e8f0&top=shortHair` 
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}&backgroundColor=e2e8f0&top=longHair`;
        
        await addDoc(collection(db, 'teachers'), {
          name: t.name,
          position: t.position,
          subject: t.subject,
          phone: '0856-XXXX-XXXX',
          email: `${t.name.toLowerCase().split(' ')[0]}@smkit-iqro.sch.id`,
          imageUrl: imageUrl,
          createdAt: new Date()
        });
      }
      toast.success('18 Data guru berhasil disinkronkan ke database!');
    } catch (error) {
      toast.error('Gagal sinkronisasi data.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Kelola Dewan Guru</h1>
          <p className="text-slate-500 font-medium">Tambah, edit, atau hapus profil guru SMK IT IQRO.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold border-2 border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Sinkronkan Data
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Guru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-medium">Memuat data guru...</div>
          ) : teachers.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-medium">Belum ada data guru.</div>
          ) : (
            teachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 group"
              >
                <div className="h-60 relative overflow-hidden">
                  <img 
                    src={teacher.imageUrl} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${teacher.name}&background=e2e8f0&color=475569&size=512`;
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(teacher)} className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl text-secondary-600 hover:bg-secondary-600 hover:text-white transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(teacher)} className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-2">{teacher.position}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{teacher.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{teacher.subject}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">{currentTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h2>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex gap-8 items-start">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 flex-shrink-0 relative overflow-hidden group">
                      {formData.imageUrl || formData.image ? (
                        <img 
                          src={formData.image ? URL.createObjectURL(formData.image) : formData.imageUrl} 
                          className="w-full h-full object-cover" 
                          alt="Preview"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${formData.name || 'Guru'}&background=e2e8f0&color=475569&size=512`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="text-white w-6 h-6" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                        <input 
                          type="text" required
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Jabatan</label>
                        <input 
                          type="text" required
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Atau Gunakan Link Foto (URL)</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      className="w-full px-5 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium text-sm"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value, image: null})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
                      <input 
                        type="text" required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                      <input 
                        type="tel" placeholder="0812..."
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Guru</label>
                    <input 
                      type="email" placeholder="nama.guru@smk.sch.id"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={uploading}
                    className="w-full py-5 bg-secondary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-secondary-600/20 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5" />}
                    {currentTeacher ? 'Simpan Perubahan' : 'Tambah Guru'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTeachers;
