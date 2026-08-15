import { motion } from 'framer-motion';

const structure = [
  {
    category: 'Dewan Kehormatan',
    members: [
      { name: 'Budi Santoso', role: 'Pendiri', image: '/images/rehearsal_1786818342263.jpg' },
      { name: 'Ahmad Dahlan', role: 'Pembina Utama', image: '/images/stage_performance_1786818192677.jpg' }
    ]
  },
  {
    category: 'Badan Pengurus Inti',
    members: [
      { name: 'Sarah Wijayanto', role: 'Ketua Umum', image: '/images/musical_performance_1786818204485.jpg' },
      { name: 'Dimas Anggara', role: 'Wakil Ketua', image: '/images/group_photo_1786818355859.jpg' },
      { name: 'Nadia Putri', role: 'Sekretaris', image: '/images/rehearsal_1786818342263.jpg' },
      { name: 'Reza Rahardian', role: 'Bendahara', image: '/images/stage_performance_1786818192677.jpg' }
    ]
  },
  {
    category: 'Kepala Divisi',
    members: [
      { name: 'Aris Nugraha', role: 'Divisi Produksi', image: '/images/musical_performance_1786818204485.jpg' },
      { name: 'Putri Marino', role: 'Divisi Akademi', image: '/images/rehearsal_1786818342263.jpg' },
      { name: 'Andi Rianto', role: 'Divisi Humas & Media', image: '/images/stage_performance_1786818192677.jpg' },
      { name: 'Baskara Putra', role: 'Divisi Sponsorship', image: '/images/group_photo_1786818355859.jpg' }
    ]
  }
];

export default function Pengurus() {
  return (
    <div className="pt-24 min-h-screen bg-primary pb-20">
      
      {/* Header */}
      <div className="text-center mb-16 container mx-auto px-6 lg:px-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-4"
        >
          Struktur Organisasi
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-supporting font-body max-w-2xl mx-auto text-lg"
        >
          Mengenal lebih dekat para penggerak di balik layar Teater Senapati periode kepengurusan saat ini.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {structure.map((section, idx) => (
          <div key={idx} className="mb-20 last:mb-0">
            <h2 className="text-2xl font-heading font-bold text-accent-primary mb-8 border-b border-white/10 pb-4 flex items-center justify-center md:justify-start">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {section.members.map((member, mIdx) => (
                <motion.div 
                  key={mIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mIdx * 0.1 }}
                  className="bg-secondary border border-white/10 rounded-sm overflow-hidden group hover:border-accent-primary/50 transition-colors"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-heading font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-xs font-button tracking-widest text-accent-primary uppercase">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}