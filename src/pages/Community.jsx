import { motion } from 'framer-motion';
import { Users, GraduationCap, Briefcase, Handshake } from 'lucide-react';
import { cn } from '../lib/utils';

const communityCards = [
  {
    id: 'active',
    title: 'Anggota Aktif',
    description: 'Generasi penerus yang terus berkarya di atas panggung dan di balik layar.',
    icon: <Users className="w-8 h-8 text-accent-primary" />,
    image: '/images/rehearsal_1786818342263.jpg'
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'Jaringan kuat lintas generasi yang telah menempuh karir profesional di berbagai bidang.',
    icon: <GraduationCap className="w-8 h-8 text-accent-primary" />,
    image: '/images/group_photo_1786818355859.jpg'
  },
  {
    id: 'management',
    title: 'Pengurus',
    description: 'Tim dedikatif yang mengelola organisasi, memproduksi karya, dan menjaga kelestarian komunitas.',
    icon: <Briefcase className="w-8 h-8 text-accent-primary" />,
    image: '/images/musical_performance_1786818204485.jpg'
  },
  {
    id: 'partners',
    title: 'Mitra & Sponsor',
    description: 'Institusi dan individu yang berkolaborasi membangun ekosistem seni dan budaya.',
    icon: <Handshake className="w-8 h-8 text-accent-primary" />,
    image: '/images/stage_performance_1786818192677.jpg'
  }
];

export default function Community() {
  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">KOMUNITAS KAMI</span>
          <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-6">Satu Keluarga Besar</h1>
          <p className="text-supporting max-w-2xl mx-auto">Teater Senapati bukan sekadar tempat berkarya, melainkan rumah bagi ratusan jiwa kreatif yang terhubung oleh seni dan persaudaraan.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-64 md:h-80 overflow-hidden cursor-pointer border border-white/5"
            >
              <div className="absolute inset-0 bg-secondary/80 group-hover:bg-primary/40 transition-colors duration-500 z-10" />
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-supporting text-sm font-body line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
