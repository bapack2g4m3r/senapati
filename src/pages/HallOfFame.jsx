import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Award, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = ['Semua', 'Aktor Terbaik', 'Sutradara Terbaik', 'Penulis Naskah Terbaik', 'Penata Artistik Terbaik', 'Penata Musik Terbaik', 'Alumni Inspiratif'];

const hallOfFameData = [
  {
    id: 1,
    name: 'Reza Rahadian',
    batch: 2004,
    role: 'Aktor Utama',
    category: 'Aktor Terbaik',
    performances: ['Kasidah Cinta (2005)', 'Mesin Waktu (2006)'],
    achievements: ['Pemeran Utama Pria Terbaik FFI'],
    profession: 'Aktor Profesional',
    image: '/images/rehearsal_1786818342263.jpg',
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    id: 2,
    name: 'Garin Nugroho',
    batch: 2002,
    role: 'Sutradara',
    category: 'Sutradara Terbaik',
    performances: ['Monolog (2002)', 'Bayang (2004)'],
    achievements: ['Sutradara Terbaik Nasional'],
    profession: 'Sutradara Film',
    image: '/images/stage_performance_1786818192677.jpg',
    socials: { instagram: '#', twitter: '#' }
  },
  {
    id: 3,
    name: 'Anya Geraldine',
    batch: 2012,
    role: 'Aktor Pendukung',
    category: 'Alumni Inspiratif',
    performances: ['Putri Malam (2013)'],
    achievements: ['Pengusaha Muda Sukses'],
    profession: 'Entrepreneur / Public Figure',
    image: '/images/musical_performance_1786818204485.jpg',
    socials: { instagram: '#' }
  }
];

export default function HallOfFame() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = hallOfFameData.filter(item => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-24 min-h-screen bg-primary pb-20">
      {/* Header Section */}
      <div className="relative py-20 bg-secondary/50 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="/images/group_photo_1786818355859.jpg" className="w-full h-full object-cover grayscale blur-sm" alt="Background" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Award className="w-16 h-16 text-accent-primary mx-auto mb-6" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading-alt font-bold text-white mb-4">
            Hall of Fame
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-supporting font-body max-w-2xl mx-auto text-lg">
            Mengapresiasi dedikasi, karya, dan jejak langkah para anggota serta alumni yang telah memberikan kontribusi luar biasa bagi perjalanan Teater Senapati.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 text-xs font-button tracking-widest rounded-sm border transition-all",
                  activeCategory === cat 
                    ? "bg-accent-primary border-accent-primary text-white font-bold" 
                    : "bg-transparent border-white/20 text-supporting hover:border-white hover:text-white"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-supporting" />
            <input 
              type="text" 
              placeholder="Cari nama atau peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-white/20 text-white pl-10 pr-4 py-3 text-sm font-body focus:outline-none focus:border-accent-primary transition-colors rounded-sm"
            />
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((person, idx) => (
            <motion.div 
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-secondary border border-white/10 rounded-sm overflow-hidden group hover:border-accent-primary/50 transition-colors"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-accent-primary text-white text-[10px] font-button font-bold tracking-widest px-3 py-1 uppercase rounded-sm">
                  {person.category}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <span className="text-accent-primary font-mono text-sm mb-1 block">Angkatan {person.batch}</span>
                  <h3 className="text-3xl font-heading font-bold text-white mb-1">{person.name}</h3>
                  <p className="text-supporting font-body text-sm">{person.role}</p>
                </div>
              </div>

              <div className="p-6 bg-primary space-y-4">
                <div>
                  <p className="text-[10px] font-button tracking-widest text-supporting uppercase mb-1">Pementasan Utama</p>
                  <p className="text-white font-body text-sm">{person.performances.join(', ')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-button tracking-widest text-supporting uppercase mb-1">Prestasi</p>
                  <p className="text-white font-body text-sm text-accent-primary">{person.achievements.join(', ')}</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-button tracking-widest text-supporting uppercase mb-1">Profesi Saat Ini</p>
                    <p className="text-white font-body text-sm font-medium">{person.profession}</p>
                  </div>
                  <div className="flex space-x-2">
                    {person.socials.instagram && <a href={person.socials.instagram} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-supporting hover:text-white hover:bg-accent-primary transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                    {person.socials.linkedin && <a href={person.socials.linkedin} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-supporting hover:text-white hover:bg-accent-primary transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                    {person.socials.twitter && <a href={person.socials.twitter} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-supporting hover:text-white hover:bg-accent-primary transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
