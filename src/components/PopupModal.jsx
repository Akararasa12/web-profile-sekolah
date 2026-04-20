import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopupModal = () => {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopup = async () => {
      // Check if already shown in this session
      const hasShown = sessionStorage.getItem('popup_shown');
      if (hasShown) return;

      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.popupActive && data.popupImageUrl) {
            setConfig(data);
            // Show after a small delay for better impact
            setTimeout(() => setShow(true), 1500);
          }
        }
      } catch (error) {
        console.error("Popup fetch error:", error);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('popup_shown', 'true');
  };

  const handleClick = () => {
    if (config.popupTargetLink) {
      handleClose();
      if (config.popupTargetLink.startsWith('http')) {
        window.open(config.popupTargetLink, '_blank');
      } else {
        navigate(config.popupTargetLink);
      }
    }
  };

  if (!config) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-fit max-w-[90vw] md:max-w-2xl bg-transparent rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div 
              className={`relative cursor-pointer group rounded-[2rem] overflow-hidden ${config.popupTargetLink ? 'hover:opacity-95' : ''}`}
              onClick={handleClick}
            >
              <img 
                src={config.popupImageUrl} 
                alt="Announcement" 
                className="w-full h-auto max-h-[85vh] object-contain block"
              />
              
              {config.popupTargetLink && (
                <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white px-6 py-3 rounded-2xl font-bold text-primary-600 shadow-xl flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                    Lihat Detail
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupModal;
