import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ZoomIn, Filter, X } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [selectedImg, setSelectedImg] = useState(null);

  const categories = ['Semua', 'Kegiatan', 'Fasilitas', 'Prestasi'];

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = filter === 'Semua' ? items : items.filter(item => item.category === filter);

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Galeri Sekolah
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Dokumentasi berbagai kegiatan, fasilitas, dan prestasi membanggakan di SMK IT IQRO.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${filter === cat ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 ring-4 ring-primary-600/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {cat === 'Semua' ? <ImageIcon className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <div className="col-span-full text-center py-20 text-slate-400 font-medium">Memuat galeri...</div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-400 font-medium italic">Belum ada foto yang tersedia untuk kategori ini.</div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl break-inside-avoid shadow-slate-200/50 cursor-pointer"
                  onClick={() => setSelectedImg(item)}
                >
                  <img src={item.imageUrl} alt={item.caption} className="w-full h-auto group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8 text-white">
                    <p className="text-sm font-bold text-primary-400 mb-2">{item.category || 'Galeri'}</p>
                    <h3 className="text-lg font-bold mb-4 leading-tight">{item.caption || 'Tanpa Keterangan'}</h3>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {selectedImg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md transition-all border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-[105] max-w-5xl w-full flex flex-col items-center"
            >
              <div className="w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                <img 
                  src={selectedImg.imageUrl} 
                  alt={selectedImg.caption} 
                  className="w-full max-h-[75vh] object-contain mx-auto" 
                />
              </div>
              <div className="mt-8 text-center text-white">
                <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-2">{selectedImg.category || 'Galeri'}</p>
                <h2 className="text-2xl md:text-3xl font-bold">{selectedImg.caption || 'Detail Foto'}</h2>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
