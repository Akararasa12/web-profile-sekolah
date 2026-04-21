import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, School, LogIn, LayoutDashboard } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'

const Navbar = () => {
  const { currentUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logo, setLogo] = useState('')
  const [schoolName, setSchoolName] = useState('SMK IT IQRO LELES')
  const [tagline, setTagline] = useState('Mandiri & Berakhlakul Karimah')
  const location = useLocation()

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLogo(data.logoUrl);
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.tagline) setTagline(data.tagline);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/profil' },
    { name: 'Guru', path: '/guru' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Berita', path: '/berita' },
    { name: 'PPDB', path: '/ppdb' },
  ]

  return (
    <nav className={`fixed w-full top-10 z-50 transition-all duration-300 ${scrolled ? 'bg-white py-3 shadow-xl border-b border-slate-100' : 'bg-white/90 backdrop-blur-md py-4 shadow-lg'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-lg shadow-primary-600/20 transition-all overflow-hidden border border-slate-100">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <School className="w-7 h-7" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none text-slate-900">{schoolName}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-primary-600">{tagline}</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wider transition-all ${location.pathname === link.path
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-600 hover:text-primary-600'
                }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser && (
            <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-full text-sm font-bold shadow-lg shadow-secondary-600/20 transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600'}`}
                >
                  {link.name}
                </Link>
              ))}
              {currentUser && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 justify-center px-4 py-3 bg-secondary-600 text-white rounded-xl font-bold"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Ke Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
