import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Image as ImageIcon, Video, Award, Newspaper } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = [
  { id: 'all', label: 'Semua Koleksi', icon: null },
  { id: 'script', label: 'Naskah', icon: <FileText className="w-4 h-4 mr-2" /> },
  { id: 'poster', label: 'Poster', icon: <ImageIcon className="w-4 h-4 mr-2" /> },
  { id: 'video', label: 'Video', icon: <Video className="w-4 h-4 mr-2" /> },
  { id: 'award', label: 'Penghargaan', icon: <Award className="w-4 h-4 mr-2" /> },
  { id: 'news', label: 'Kliping Berita', icon: <Newspaper className="w-4 h-4 mr-2" /> },
];

const mockArchives = [
  { id: 1, title: 'Naskah Asli "Mesin Waktu"', category: 'script', year: '2004', image: '/images/group_photo_1786818355859.jpg' },
  { id: 2, title: 'Poster Pementasan Perdana', category: 'poster', year: '2002', image: '/images/stage_performance_1786818192677.jpg' },
  { id: 3, title: 'Juara 1 FLS2N Tingkat Provinsi', category: 'award', year: '2012', image: '/images/musical_performance_1786818204485.jpg' },
  { id: 4, title: 'Liputan Pikiran Rakyat - Kasidah Cinta', category: 'news', year: '2006', image: '/images/rehearsal_1786818342263.jpg' },
  { id: 5, title: 'Dokumenter Latihan Teater 2010', category: 'video', year: '2010', image: '/images/rehearsal_1786818342263.jpg' },
  { id: 6, title: 'Naskah "Cakrawala di Langit Bandung"', category: 'script', year: '2008', image: '/images/group_photo_1786818355859.jpg' },
];

export default function Museum() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArchives = mockArchives.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">DIGITAL MUSEUM</span>
          <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-6">Arsip 25 Tahun</h1>
          <p className="text-supporting max-w-2xl mx-auto mb-8">Jelajahi koleksi digital peninggalan pementasan, naskah bersejarah, dan memori perjalanan Teater Senapati.</p>
          
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Cari naskah, poster, atau berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-white/20 text-white px-6 py-4 pl-14 font-body focus:outline-none focus:border-accent-primary transition-colors rounded-sm"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-supporting" />
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center px-4 py-2 font-button text-xs tracking-widest transition-all rounded-sm",
                activeCategory === cat.id 
                  ? "bg-white text-primary font-bold" 
                  : "bg-secondary text-supporting border border-white/10 hover:border-white hover:text-white"
              )}
            >
              {cat.icon}
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredArchives.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer bg-secondary border border-white/5 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-primary/80 backdrop-blur-sm px-2 py-1 text-xs text-white font-button tracking-widest border border-white/10">
                    {item.year}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-accent-primary text-xs font-button tracking-widest uppercase mb-2 block flex items-center">
                      {categories.find(c => c.id === item.category)?.icon}
                      {categories.find(c => c.id === item.category)?.label}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{item.title}</h3>
                  </div>
                  <button className="text-supporting text-sm font-button tracking-widest hover:text-white transition-colors mt-4 text-left border-b border-white/10 w-fit pb-1 inline-flex items-center">
                    LIHAT DETAIL
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
