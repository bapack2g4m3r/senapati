import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronRight } from 'lucide-react';

const milestones = [
  {
    year: '2002',
    title: 'Teater Senapati Didirikan',
    description: 'Teater Senapati didirikan pada 8 Mei 2002 di SMA Pasundan 3 Bandung oleh Rosyid E. Abby dan Wahyu Kelana. Berawal dari mimpi kecil, kini menjadi rumah besar bagi generasi pencinta seni.',
    image: '/images/group_photo_1786818355859.jpg'
  },
  {
    year: '2006',
    title: 'Era Keemasan Drama Musikal',
    description: 'Pementasan Kasidah Cinta menjadi titik balik, menghadirkan standar baru dalam produksi teater musikal di kalangan pelajar.',
    image: '/images/musical_performance_1786818204485.jpg'
  },
  {
    year: '2010',
    title: 'Kolaborasi Luar Sekolah',
    description: 'Mulai berkolaborasi dengan seniman dan aktor dari luar sekolah, memperluas jaringan dan kualitas artistik pertunjukan.',
    image: '/images/stage_performance_1786818192677.jpg'
  },
  {
    year: '2020',
    title: 'Transformasi Digital',
    description: 'Berdaptasi dengan pandemi melalui pertunjukan virtual dan digitalisasi arsip karya selama hampir dua dekade.',
    image: '/images/rehearsal_1786818342263.jpg'
  },
  {
    year: '2027',
    title: 'Perayaan 25 Tahun',
    description: 'Menuju seperempat abad berkarya, bertransformasi dari ekstrakurikuler menjadi pusat kebudayaan dan rumah produksi kreatif.',
    image: '/images/group_photo_1786818355859.jpg'
  }
];

export default function History() {
  const [activeYear, setActiveYear] = useState(milestones[0]);

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">SEJARAH KAMI</span>
          <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-4">Perjalanan Waktu</h1>
          <p className="text-supporting max-w-2xl">Dari panggung sekolah menuju panggung yang lebih luas. Menyusuri jejak langkah Teater Senapati dari masa ke masa.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline Navigation */}
          <div className="lg:col-span-3 flex flex-col space-y-8 relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-white/10" />
            {milestones.map((m) => (
              <button
                key={m.year}
                onClick={() => setActiveYear(m)}
                className={cn(
                  "relative flex items-center text-left pl-10 group transition-all duration-300",
                  activeYear.year === m.year ? "opacity-100" : "opacity-50 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "absolute left-1.5 w-3.5 h-3.5 rounded-full transform -translate-x-1/2 transition-colors duration-300 z-10",
                  activeYear.year === m.year ? "bg-accent-primary ring-4 ring-accent-primary/30" : "bg-white/20 group-hover:bg-white/50"
                )} />
                <div>
                  <h3 className={cn(
                    "font-heading font-bold transition-all duration-300",
                    activeYear.year === m.year ? "text-3xl text-white" : "text-xl text-supporting"
                  )}>
                    {m.year}
                  </h3>
                  <p className={cn(
                    "text-sm font-body mt-1",
                    activeYear.year === m.year ? "text-accent-primary" : "hidden"
                  )}>
                    {m.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear.year}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-secondary border border-white/5 p-1 flex flex-col md:flex-row gap-8"
              >
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay z-10" />
                  <img 
                    src={activeYear.image} 
                    alt={activeYear.title}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-accent-primary font-heading text-6xl opacity-20 absolute top-4 right-8">{activeYear.year}</span>
                  <h2 className="text-3xl font-heading-alt font-bold text-white mb-6 relative z-10">{activeYear.title}</h2>
                  <p className="text-supporting leading-relaxed mb-8 font-body text-lg relative z-10">{activeYear.description}</p>
                  <button className="flex items-center text-sm font-button tracking-widest text-white hover:text-accent-primary transition-colors group w-fit">
                    LIHAT GALERI FOTO
                    <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
