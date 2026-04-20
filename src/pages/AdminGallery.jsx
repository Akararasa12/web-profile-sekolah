import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    caption: '',
    category: 'Kegiatan',
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
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
    if (!formData.image && !formData.imageUrl) {
      toast.error('Pilih gambar atau masukkan link!');
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = formatDriveUrl(formData.imageUrl);
      if (formData.image) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${formData.image.name}`);
        const uploadTask = await uploadBytes(storageRef, formData.image);
        finalImageUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'gallery'), {
        caption: formData.caption,
        category: formData.category,
        imageUrl: finalImageUrl,
        createdAt: new Date()
      });

      toast.success('Foto berhasil ditambahkan ke galeri!');
      setIsModalOpen(false);
      setFormData({ caption: '', category: 'Kegiatan', image: null, imageUrl: '' });
    } catch (error) {
      toast.error('Gagal menambah foto: ' + error.message);
    }
    setUploading(false);
  };

  const handleDelete = async (image) => {
    if (window.confirm('Hapus foto ini dari galeri?')) {
      try {
        await deleteDoc(doc(db, 'gallery', image.id));
        if (image.imageUrl && image.imageUrl.includes('firebasestorage')) {
          await deleteObject(ref(storage, image.imageUrl)).catch(() => {});
        }
        toast.success('Foto dihapus');
      } catch (error) { toast.error('Gagal menghapus'); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Kelola Galeri</h1>
          <p className="text-slate-500 font-medium">Unggah dokumentasi kegiatan sekolah.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Foto
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">Memuat galeri...</div>
        ) : images.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">Belum ada foto di galeri.</div>
        ) : (
          images.map((img) => (
            <motion.div 
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg"
            >
              <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                <button 
                  onClick={() => handleDelete(img)}
                  className="self-end p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-white text-xs font-medium leading-relaxed line-clamp-2">{img.caption}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Upload */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Tambah Foto Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Keterangan Foto</label>
                    <input 
                      type="text" required
                      placeholder="Contoh: Lomba 17 Agustus"
                      className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.caption}
                      onChange={e => setFormData({...formData, caption: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Kategori</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Fasilitas">Fasilitas</option>
                      <option value="Prestasi">Prestasi</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-center group hover:border-primary-500 transition-colors cursor-pointer relative">
                    {formData.image || formData.imageUrl ? (
                      <img src={formData.image ? URL.createObjectURL(formData.image) : formData.imageUrl} className="max-h-40 mx-auto rounded-xl shadow-md" alt="" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2 group-hover:text-primary-500 transition-colors" />
                        <p className="text-xs font-bold text-slate-400">Pilih File Foto</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </div>
                  
                  <div className="text-center text-[10px] font-bold text-slate-300">--- ATAU ---</div>
                  
                  <input 
                    type="text" 
                    placeholder="Link Gambar (URL)"
                    className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value, image: null})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full py-5 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5" />}
                  Simpan ke Galeri
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
