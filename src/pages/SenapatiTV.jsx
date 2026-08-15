import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock DB for Senapati TV
const videoCategories = [
  'Semua', 'Dokumentasi Pementasan', 'Trailer', 'Behind the scenes', 'Wawancara Alumni', 'Dokumentasi Latihan', 'Reuni'
];

const videos = [
  {
    id: 1,
    title: 'Trailer Kasidah Cinta 2014',
    category: 'Trailer',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/musical_performance_1786818204485.jpg',
    description: 'Cuplikan kemegahan drama musikal Kasidah Cinta yang memukau ribuan penonton.'
  },
  {
    id: 2,
    title: 'Di Balik Layar: Mesin Waktu',
    category: 'Behind the scenes',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/stage_performance_1786818192677.jpg',
    description: 'Proses kreatif dan perjuangan para aktor dalam mempersiapkan lakon Mesin Waktu.'
  },
  {
    id: 3,
    title: 'Latihan Fisik Angkatan 12',
    category: 'Dokumentasi Latihan',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/rehearsal_1786818342263.jpg',
    description: 'Intensitas dan disiplin dalam setiap sesi latihan fisik calon anggota Teater Senapati.'
  },
  {
    id: 4,
    title: 'Malam Reuni Perak 25 Tahun',
    category: 'Reuni',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/group_photo_1786818355859.jpg',
    description: 'Malam penuh kehangatan mengumpulkan seluruh lintas generasi dari 2002 hingga 2027.'
  }
];

export default function SenapatiTV() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);

  const featuredVideo = videos[0];

  const filteredVideos = videos.filter(v => {
    const matchCat = activeCategory === 'Semua' || v.category === activeCategory;
    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Featured Video / Hero (Netflix Style) */}
      <div className="relative w-full h-[70vh] md:h-[80vh] bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={featuredVideo.thumbnail} alt={featuredVideo.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16 lg:pb-32 z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-accent-primary font-heading-alt text-2xl font-bold tracking-widest uppercase">Senapati</span>
              <span className="bg-accent-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">TV</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading-alt font-bold text-white mb-4 leading-tight">{featuredVideo.title}</h1>
            <p className="text-supporting font-body text-lg mb-8 line-clamp-3 drop-shadow-md">{featuredVideo.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setPlayingVideo(featuredVideo)}
                className="flex items-center space-x-2 bg-white hover:bg-white/90 text-primary px-6 py-3 font-button font-bold tracking-widest rounded-sm transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PUTAR SEKARANG</span>
              </button>
              <button className="flex items-center space-x-2 bg-secondary/80 hover:bg-secondary border border-white/20 text-white px-6 py-3 font-button tracking-widest rounded-sm backdrop-blur-sm transition-colors">
                <Info className="w-5 h-5" />
                <span>SELENGKAPNYA</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        {/* Navigation & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-secondary/80 backdrop-blur-md p-4 border border-white/10 rounded-sm">
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide space-x-2">
            {videoCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-xs font-button tracking-widest transition-colors rounded-sm",
                  activeCategory === cat ? "bg-accent-primary text-white font-bold" : "text-supporting hover:text-white hover:bg-white/5"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-supporting" />
            <input 
              type="text" 
              placeholder="Cari video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-primary border border-white/20 text-white pl-10 pr-4 py-2 text-sm font-body focus:outline-none focus:border-accent-primary transition-colors rounded-sm"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">
            {activeCategory === 'Semua' ? 'Rekomendasi Untuk Anda' : activeCategory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.map((video, idx) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setPlayingVideo(video)}
                className="group cursor-pointer relative aspect-video bg-secondary overflow-hidden rounded-sm border border-white/5"
              >
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/40 group-hover:bg-transparent transition-colors duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/90 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-primary to-transparent">
                  <span className="text-[10px] text-accent-primary font-button tracking-widest uppercase mb-1 block">{video.category}</span>
                  <h3 className="text-sm font-heading font-bold text-white line-clamp-1">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 lg:p-12">
          <button 
            onClick={() => setPlayingVideo(null)}
            className="absolute top-6 right-6 lg:top-12 lg:right-12 text-white/50 hover:text-white transition-colors"
          >
            Tutup (X)
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0`} 
              title={playingVideo.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="w-full max-w-5xl mt-6 text-left">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">{playingVideo.title}</h2>
            <p className="text-supporting font-body text-sm max-w-3xl">{playingVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}