import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { School, ArrowRight, ShieldCheck, Cpu, Users } from 'lucide-react'
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import Profil from './pages/Profil'
import Teachers from './pages/Teachers'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import PPDB from './pages/PPDB'
import AdminApplicants from './pages/AdminApplicants'
import AdminTeachers from './pages/AdminTeachers'
import AdminBlog from './pages/AdminBlog'
import AdminGallery from './pages/AdminGallery'
import AdminSettings from './pages/AdminSettings'
import AdminGuide from './pages/AdminGuide'
import PopupModal from './components/PopupModal'
import TopBanner from './components/TopBanner'
import SideWatermark from './components/SideWatermark'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import { Toaster } from 'react-hot-toast'

// Dashboard Component
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

// Landing Page Component
const Home = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    '/assets/hero/bg1.png',
    '/assets/hero/bg2.png',
    '/assets/hero/bg3.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden bg-slate-900">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto relative z-10 text-left lg:px-20"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-xs font-bold mb-10 backdrop-blur-md shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Terakreditasi A & Berstandar Industri
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-[1.1]">
            SMK Islam Terpadu <br />
            <span className="text-primary-500">Iqro</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-medium">
            Mencetak Generasi Unggul dalam Imtak dan Iptek, Berkarakter Islami, dan Siap Bersaing di Dunia Global.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <motion.a
              href="/ppdb"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-primary-600/30 transition-all text-lg"
            >
              Daftar Sekarang (PPDB)
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="/profil"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 backdrop-blur-md transition-all text-lg"
            >
              Kenali Kami
            </motion.a>
          </div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBg(i)}
              className={`h-2 rounded-full transition-all duration-300 ${currentBg === i ? 'w-10 bg-primary-500' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Program Keahlian Section */}
      <section className="py-32 bg-slate-50/50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
            >
              Program Keahlian
            </motion.h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
              Kurikulum berbasis industri yang dirancang untuk membekali siswa dengan keahlian spesifik dan relevan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* TKJ */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-primary-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-primary-600 transition-colors mx-auto">
                <Cpu className="w-10 h-10 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Teknik Komputer dan Jaringan</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Mempelajari instalasi jaringan LAN, WAN, administrasi server, serta keamanan infrastruktur IT berstandar global.
              </p>
            </motion.div>

            {/* OTKP */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-secondary-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-secondary-600 transition-colors mx-auto">
                <Users className="w-10 h-10 text-secondary-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Otomatisasi dan Tata Kelola Perkantoran</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Fokus pada manajemen kearsipan, korespondensi bisnis, teknologi perkantoran modern, dan layanan prima.
              </p>
            </motion.div>

            {/* ATPH */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-green-600 transition-colors mx-auto">
                <div className="text-green-600 group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6.4 8-12a1 1 0 0 0-1-1c-5.6 0-9.5 2.5-12 8a1 1 0 0 0 1 1c0-5.6 2.5-9.5 8-12"/><path d="M14 20c-5.5-2.5-8-6.4-8-12a1 1 0 0 1 1-1c5.6 0 9.5 2.5 12 8a1 1 0 0 1-1 1c0-5.6-2.5-9.5-8-12"/></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Agribisnis Tanaman Pangan dan Hortikultura</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Menguasai teknologi budidaya tanaman, manajemen agribisnis, serta inovasi pertanian berkelanjutan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            padding: '16px 24px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #f1f5f9',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <TopBanner />
        <SideWatermark />
        <PopupModal />
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profil" element={<MainLayout><Profil /></MainLayout>} />
          <Route path="/guru" element={<MainLayout><Teachers /></MainLayout>} />
          <Route path="/galeri" element={<MainLayout><Gallery /></MainLayout>} />
          <Route path="/berita" element={<MainLayout><Blog /></MainLayout>} />
          <Route path="/berita/:id" element={<MainLayout><BlogPost /></MainLayout>} />
          <Route path="/ppdb" element={<MainLayout><PPDB /></MainLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/applicants" element={
            <ProtectedRoute>
              <AdminLayout><AdminApplicants /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/teachers" element={
            <ProtectedRoute>
              <AdminLayout><AdminTeachers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog" element={
            <ProtectedRoute>
              <AdminLayout><AdminBlog /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <AdminLayout><AdminGallery /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminLayout><AdminSettings /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/guide" element={
            <ProtectedRoute>
              <AdminLayout><AdminGuide /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <MainLayout>
              <div className="min-h-screen flex items-center justify-center text-center p-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4 text-primary-600">Halaman Belum Tersedia</h1>
                  <p className="text-slate-500 mb-8 font-medium">Halaman ini sedang dalam tahap pengembangan.</p>
                  <a href="/" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold">Kembali ke Beranda</a>
                </div>
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
