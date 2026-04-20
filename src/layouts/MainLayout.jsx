import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import { School } from 'lucide-react'

const MainLayout = ({ children }) => {
  const [settings, setSettings] = useState({
    schoolName: 'SMK IT IQRO',
    logoUrl: '',
    description: 'Mencetak Generasi Unggul dalam Imtak dan Iptek. Berkarakter Islami, Berprestasi, dan Siap Menghadapi Masa Depan.',
    address: 'Jl. Raya Pendidikan No. 123, Garut, Jawa Barat',
    email: 'info@smkit-iqro.sch.id',
    phone: '(0262) 123456'
  })

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <School className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">{settings.schoolName}</h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {settings.description}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-wider text-xs">Tautan Cepat</h4>
              <ul className="space-y-3 text-slate-600 text-sm font-medium">
                <li><a href="/profil" className="hover:text-primary-600 transition-colors">Profil Sekolah</a></li>
                <li><a href="/guru" className="hover:text-primary-600 transition-colors">Daftar Guru</a></li>
                <li><a href="/berita" className="hover:text-primary-600 transition-colors">Berita Terkini</a></li>
                <li><a href="/ppdb" className="hover:text-primary-600 transition-colors">Pendaftaran (PPDB)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-wider text-xs">Program Keahlian</h4>
              <ul className="space-y-3 text-slate-600 text-sm font-medium">
                <li>Teknik Komputer & Jaringan</li>
                <li>Otomatisasi dan Tata Kelola Perkantoran</li>
                <li>Agribisnis Tanaman Pangan dan Hortikultura</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-wider text-xs">Kontak Kami</h4>
              <ul className="space-y-3 text-slate-600 text-sm font-medium">
                <li>{settings.address}</li>
                <li>Email: {settings.email}</li>
                <li>Telp: {settings.phone}</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {settings.schoolName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
