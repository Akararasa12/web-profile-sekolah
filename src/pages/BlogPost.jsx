import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-slate-400 font-medium">Memuat artikel...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Artikel Tidak Ditemukan</h2>
          <Link to="/berita" className="text-primary-600 font-bold flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/berita" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold mb-10 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Kembali ke Berita
          </Link>

          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                {post.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary-500" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                5 Menit Baca
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 leading-tight">
              {post.title}
            </h1>

            {/* Featured Image */}
            <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-16 aspect-video">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Footer */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penulis</p>
                  <p className="font-bold text-slate-900">{post.author}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 rounded-2xl font-bold transition-all">
                <Share2 className="w-4 h-4" />
                Bagikan Artikel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
