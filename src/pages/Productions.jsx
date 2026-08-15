import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = ['Semua', 'Drama', 'Drama Musikal', 'Puisi', 'Monolog', 'Film Pendek'];

const productions = [
  {
    id: 1,
    title: 'Kasidah Cinta',
    category: 'Drama Musikal',
    year: '2006 - 2014',
    director: 'Rosyid E. Abby',
    poster: '/images/musical_performance_1786818204485.jpg',
    synopsis: 'Sebuah mahakarya teater musikal yang mengangkat kisah cinta sejati dengan latar belakang budaya lokal yang kental.',
  },
  {
    id: 2,
    title: 'Mesin Waktu',
    category: 'Drama',
    year: '2004',
    director: 'Wahyu Kelana',
    poster: '/images/stage_performance_1786818192677.jpg',
    synopsis: 'Eksplorasi tentang waktu, penyesalan, dan kesempatan kedua dalam balutan drama surealis.',
  },
  {
    id: 3,
    title: 'Cakrawala di Langit Bandung',
    category: 'Drama',
    year: '2008',
    director: 'Tim Sutradara TS',
    poster: '/images/rehearsal_1786818342263.jpg',
    synopsis: 'Kisah perjuangan pemuda-pemudi di masa pergolakan, memperebutkan harapan di bawah langit kota.',
  },
  {
    id: 4,
    title: 'Mulung Muntah',
    category: 'Drama',
    year: '2011',
    director: 'Rosyid E. Abby',
    poster: '/images/group_photo_1786818355859.jpg',
    synopsis: 'Kritik sosial yang dibalut dalam komedi satir tentang realitas kehidupan kelas bawah perkotaan.',
  },
];

export default function Productions() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredProductions = activeCategory === 'Semua' 
    ? productions 
    : productions.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">KARYA KAMI</span>
            <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white">Arsip Pementasan</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 font-button text-xs tracking-widest transition-all rounded-sm border",
                  activeCategory === cat 
                    ? "bg-accent-primary border-accent-primary text-white" 
                    : "border-white/20 text-supporting hover:border-white hover:text-white"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProductions.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-secondary cursor-pointer overflow-hidden border border-white/5"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={item.poster} 
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-primary via-primary/80 to-transparent z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-accent-primary font-button text-xs tracking-widest block mb-2">{item.year}</span>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-supporting text-sm font-body line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.synopsis}
                    </p>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <button className="text-white hover:text-accent-primary transition-colors flex items-center text-xs font-button">
                        <Play className="w-4 h-4 mr-1" /> TRAILER
                      </button>
                      <button className="text-white hover:text-accent-primary transition-colors flex items-center text-xs font-button">
                        <ImageIcon className="w-4 h-4 mr-1" /> GALERI
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
