import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Image as ImageIcon, 
  UserPlus, 
  Settings, 
  LogOut,
  ChevronRight,
  School,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Menutup menu otomatis saat berpindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Pendaftar PPDB', icon: UserPlus, path: '/admin/applicants' },
    { name: 'Kelola Guru', icon: Users, path: '/admin/teachers' },
    { name: 'Kelola Berita', icon: Newspaper, path: '/admin/blog' },
    { name: 'Kelola Galeri', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Pengaturan', icon: Settings, path: '/admin/settings' },
    { name: 'Panduan Admin', icon: BookOpen, path: '/admin/guide' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-3 border-b border-slate-50">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <School className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 leading-none">SMK IT IQRO</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
              location.pathname === item.path 
              ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </div>
            {location.pathname === item.path && (
              <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="p-4 bg-slate-50 rounded-2xl mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
            {currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-900 truncate">{currentUser?.email}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Administrator</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Keluar Panel
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[101] flex flex-col shadow-2xl lg:hidden"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 min-h-screen pt-10">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-10 z-10 lg:hidden">
          <div className="flex items-center gap-3">
            <School className="text-primary-600 w-6 h-6" />
            <span className="font-bold text-slate-900">SMK IT IQRO Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
