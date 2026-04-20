import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GraduationCap, X, MessageCircle, Phone, ArrowRight } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'teachers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
            Dewan Guru
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Tenaga pengajar profesional yang berdedikasi tinggi untuk membimbing siswa meraih prestasi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">Memuat data guru...</div>
          ) : teachers.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">Belum ada data guru yang tersedia.</div>
          ) : (
            teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/60 group hover:shadow-2xl transition-all"
              >
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={teacher.imageUrl} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button 
                      onClick={() => setSelectedTeacher(teacher)}
                      className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Kontak Guru
                    </button>
                  </div>
                </div>
                <div className="p-8 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary-600 font-bold text-xs uppercase tracking-widest mb-2">
                    <GraduationCap className="w-4 h-4" />
                    {teacher.position}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{teacher.name}</h3>
                  <p className="text-slate-500 font-medium text-sm">{teacher.subject}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeacher(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="relative mb-8 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Hubungi Guru</h2>
                  <button onClick={() => setSelectedTeacher(null)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-10 p-4 bg-slate-50 rounded-[2rem]">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img src={selectedTeacher.imageUrl} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedTeacher.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{selectedTeacher.subject}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <a 
                    href={`https://wa.me/${selectedTeacher.phone?.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl font-bold transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-green-600/60">WhatsApp</p>
                        <p>{selectedTeacher.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a 
                    href={`mailto:${selectedTeacher.email}`}
                    className="flex items-center justify-between p-5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-blue-600/60">Email</p>
                        <p className="text-sm lowercase">{selectedTeacher.email || 'N/A'}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>

                <p className="text-center text-slate-400 text-xs font-medium mt-10">
                  Silakan hubungi pada jam kerja sekolah.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teachers;
