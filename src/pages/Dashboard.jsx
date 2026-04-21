import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const Dashboard = () => {
  const [stats, setStats] = useState({ ppdb: 0, teachers: 0, posts: 0 });

  useEffect(() => {
    // Fetch PPDB Count
    const unsubPPDB = onSnapshot(collection(db, 'registrations'), (snap) => {
      setStats(prev => ({ ...prev, ppdb: snap.size }));
    });
    // Fetch Teachers Count
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snap) => {
      setStats(prev => ({ ...prev, teachers: snap.size }));
    });
    // Fetch Posts Count
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setStats(prev => ({ ...prev, posts: snap.size }));
    });

    return () => {
      unsubPPDB();
      unsubTeachers();
      unsubPosts();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard Overview</h1>
      <p className="text-slate-500 font-medium">Statistik dan ringkasan data sekolah secara real-time.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-primary-500/50 transition-colors">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Pendaftar PPDB</h3>
          <div className="flex items-end justify-between">
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{stats.ppdb}</div>
            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold">Terbaru</div>
          </div>
        </div>
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-secondary-500/50 transition-colors">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Total Guru</h3>
          <div className="flex items-end justify-between">
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{stats.teachers}</div>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Aktif</div>
          </div>
        </div>
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-indigo-500/50 transition-colors">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Artikel Berita</h3>
          <div className="flex items-end justify-between">
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{stats.posts}</div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">Terbit</div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-10 bg-secondary-600 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-secondary-600/20">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Selamat Datang di Panel Admin!</h2>
          <p className="text-secondary-100 font-medium mb-8 leading-relaxed">
            Di sini Anda dapat mengelola seluruh konten website SMK IT IQRO, mulai dari data pendaftar hingga berita terbaru.
          </p>
          <Link to="/admin/guide" className="inline-flex px-6 py-3 bg-white text-secondary-600 rounded-2xl font-bold items-center gap-2">
            Lihat Panduan Admin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>
    </div>
  );
}

export default Dashboard
