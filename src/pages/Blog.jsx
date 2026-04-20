import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Berita & Artikel
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Ikuti perkembangan terbaru, kegiatan, dan prestasi siswa SMK IT IQRO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">Memuat berita...</div>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">Belum ada berita yang diterbitkan.</div>
          ) : (
            posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 group flex flex-col hover:shadow-2xl transition-all"
              >
                <Link to={`/berita/${post.id}`} className="block h-64 overflow-hidden relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-primary-600 shadow-sm flex items-center gap-2">
                      <Newspaper className="w-3 h-3" />
                      Warta Sekolah
                    </span>
                  </div>
                </Link>
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </div>
                  </div>
                  <Link to={`/berita/${post.id}`}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <div 
                    className="text-slate-500 leading-relaxed mb-8 line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="mt-auto">
                    <Link to={`/berita/${post.id}`} className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
