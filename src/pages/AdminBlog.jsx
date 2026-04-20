import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload, Newspaper, Calendar, User, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
    imageUrl: ''
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const options = { maxSizeMB: 0.7, maxWidthOrHeight: 1200, useWebWorker: true };
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
        const storageRef = ref(storage, `blog/${Date.now()}_${formData.image.name}`);
        const uploadTask = await uploadBytes(storageRef, formData.image);
        finalImageUrl = await getDownloadURL(uploadTask.ref);
      }

      const postData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        imageUrl: finalImageUrl,
        updatedAt: new Date()
      };

      if (currentPost) {
        await updateDoc(doc(db, 'posts', currentPost.id), postData);
        toast.success('Berita berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'posts'), { ...postData, createdAt: new Date() });
        toast.success('Berita berhasil diterbitkan!');
      }
      handleCloseModal();
    } catch (error) { 
      console.error(error);
      toast.error('Gagal menyimpan berita: ' + error.message);
    }
    setUploading(false);
  };

  const handleDelete = async (post) => {
    if (window.confirm('Hapus artikel ini?')) {
      await deleteDoc(doc(db, 'posts', post.id));
      if (post.imageUrl) await deleteObject(ref(storage, post.imageUrl)).catch(() => {});
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData({ title: post.title, content: post.content, author: post.author, imageUrl: post.imageUrl, image: null });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
    setFormData({ title: '', content: '', author: '', image: null, imageUrl: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Kelola Berita</h1>
          <p className="text-slate-500 font-medium">Tulis dan publikasikan berita terbaru sekolah.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all">
          <Plus className="w-5 h-5" />
          Tulis Berita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? <div className="col-span-full text-center py-20">Memuat berita...</div> : posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
            <div className="h-48 relative">
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(post)} className="p-2 bg-white rounded-lg text-secondary-600 shadow-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(post)} className="p-2 bg-white rounded-lg text-red-500 shadow-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>
              <div className="text-sm text-slate-500 line-clamp-2 mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.createdAt?.toDate().toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Rich Text Editor Integrated */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-4xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{currentPost ? 'Edit Berita' : 'Tulis Berita Baru'}</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Judul Berita</label>
                  <input type="text" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Isi Berita (Editor)</label>
                  <div className="bg-slate-50 rounded-2xl overflow-hidden border">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.content} 
                      onChange={(val) => setFormData({...formData, content: val})}
                      modules={modules}
                      className="h-64 mb-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Penulis</label>
                    <input type="text" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Thumbnail (Pilih Salah Satu)</label>
                    <div className="space-y-3">
                      <input type="file" className="w-full text-xs" onChange={handleImageChange} />
                      <div className="text-center text-[10px] font-bold text-slate-300">--- ATAU ---</div>
                      <input 
                        type="text" 
                        placeholder="Tempel Link Gambar (URL) di sini..." 
                        className="w-full p-3 bg-slate-50 border border-dashed rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm" 
                        value={formData.imageUrl} 
                        onChange={e => setFormData({...formData, imageUrl: e.target.value, image: null})} 
                      />
                    </div>
                  </div>
                </div>
                
                <button type="submit" disabled={uploading} className="w-full py-5 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-600/20 disabled:opacity-50 mt-8">
                  {uploading ? 'Menyimpan...' : (currentPost ? 'Simpan Perubahan' : 'Terbitkan Berita')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlog;
