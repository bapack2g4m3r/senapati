import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, History, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

// Mock Data
const wallData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  year: 2002 + i,
  title: `Angkatan ${i + 1}`,
  image: i % 2 === 0 ? '/images/group_photo_1786818355859.jpg' : '/images/stage_performance_1786818192677.jpg',
  membersCount: 15 + Math.floor(Math.random() * 20),
  performancesCount: 2 + Math.floor(Math.random() * 5),
  story: `Sebuah perjalanan yang dimulai pada tahun ${2002 + i}. Angkatan ini dikenal dengan semangat eksperimen dan dedikasi tinggi pada setiap latihan.`
}));

export default function DigitalWall() {
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="pt-24 min-h-screen bg-primary">
      {/* Intro Header */}
      <div className="text-center py-12 mb-8 relative">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Sparkles className="w-12 h-12 text-accent-primary mx-auto mb-4" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-4"
        >
          {t('Senapati 25 Years Digital Wall')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-supporting font-body max-w-2xl mx-auto text-lg px-6"
        >
          {t('Dinding sejarah yang mengukir jejak setiap generasi. Klik pada setiap angkatan untuk membuka arsip kenangan mereka.')}
        </motion.p>
      </div>

      {/* Grid Wall */}
      <div className="w-full h-[60vh] md:h-[80vh] bg-black overflow-y-auto overflow-x-hidden p-6 md:p-12 border-y border-white/10 shadow-inner scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10 auto-rows-max">
          {wallData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 10) * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-md border border-white/20 hover:border-accent-primary hover:shadow-[0_0_20px_rgba(200,29,37,0.4)] transition-all bg-secondary"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-primary/60 group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-accent-primary font-heading-alt font-bold text-2xl md:text-3xl drop-shadow-md mb-1">{item.year}</span>
                <span className="text-white font-button text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-primary/95 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-secondary border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors bg-primary/50 p-2 rounded-full backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary hidden md:block" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto bg-secondary">
                <div className="mb-2">
                  <span className="inline-block bg-accent-primary/20 text-accent-primary px-3 py-1 text-xs font-button tracking-widest uppercase rounded-sm border border-accent-primary/30">
                    {t('Tahun')} {selectedItem.year}
                  </span>
                </div>
                <h2 className="text-4xl font-heading font-bold text-white mb-6">{selectedItem.title}</h2>
                
                <p className="text-supporting font-body leading-relaxed mb-8">
                  {selectedItem.story}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <div className="flex items-center space-x-2 text-supporting mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-button tracking-widest uppercase">{t('Anggota Terdata')}</span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">{selectedItem.membersCount} {t('Orang')}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-supporting mb-1">
                      <History className="w-4 h-4" />
                      <span className="text-xs font-button tracking-widest uppercase">{t('Pementasan')}</span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">{selectedItem.performancesCount} {t('Karya')}</p>
                  </div>
                </div>
                
                <button className="w-full mt-8 bg-transparent border border-white/20 hover:bg-white hover:text-primary transition-colors text-white py-3 font-button tracking-widest text-sm uppercase rounded-sm">
                  {t('Lihat Arsip Lengkap')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}