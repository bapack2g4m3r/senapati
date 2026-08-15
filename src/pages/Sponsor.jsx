import { motion } from 'framer-motion';
import { Download, Briefcase, Star, Gem, Crown, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const stats = [
  { label: 'Tahun Perjalanan', value: '25' },
  { label: 'Alumni & Anggota', value: '500+' },
  { label: 'Pementasan Besar', value: '40+' },
  { label: 'Penghargaan', value: '25+' },
];

const packages = [
  {
    name: 'Bronze',
    icon: <Briefcase className="w-8 h-8" />,
    price: 'Mulai dari Rp 5 Juta',
    benefits: ['Penyebutan nama di panggung', 'Logo kecil di poster', '2 Tiket VIP pementasan', 'Sertifikat Apresiasi'],
    color: 'border-amber-700/50 text-amber-700'
  },
  {
    name: 'Silver',
    icon: <Star className="w-8 h-8" />,
    price: 'Mulai dari Rp 15 Juta',
    benefits: ['Penyebutan nama di panggung', 'Logo medium di poster & tiket', '5 Tiket VIP pementasan', 'Plakat Apresiasi', 'Ad-libs MC'],
    color: 'border-slate-400/50 text-slate-400',
    popular: true
  },
  {
    name: 'Gold',
    icon: <Gem className="w-8 h-8" />,
    price: 'Mulai dari Rp 30 Juta',
    benefits: ['Logo besar di semua media', '10 Tiket VVIP pementasan', 'Plakat Eksklusif', 'Ad-libs MC & Video Iklan 30s', 'Booth promosi di lokasi'],
    color: 'border-yellow-500/50 text-yellow-500'
  },
  {
    name: 'Platinum',
    icon: <Crown className="w-8 h-8" />,
    price: 'Sponsor Utama',
    benefits: ['Eksklusivitas industri', 'Logo terbesar (Titling)', '20 Tiket VVIP', 'Video Iklan 60s', 'Booth utama', 'Meet & Greet Aktor'],
    color: 'border-white/50 text-white'
  }
];

export default function Sponsor() {
  return (
    <div className="pt-24 min-h-screen bg-primary pb-20">
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-12 mb-20 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <span className="text-accent-primary font-button tracking-widest text-sm mb-4 block uppercase">Kemitraan & Sponsorship</span>
          <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-6 leading-tight">
            Berkolaborasi Menghidupkan Ekosistem Seni Bersama Kami
          </h1>
          <p className="text-supporting font-body text-lg mb-8">
            Teater Senapati mengundang perusahaan dan institusi Anda untuk tumbuh bersama dalam mendukung pelestarian dan inovasi seni pertunjukan di Indonesia.
          </p>
          <button className="inline-flex items-center space-x-2 bg-accent-primary hover:bg-accent-secondary text-white px-8 py-4 font-button tracking-widest text-sm font-bold uppercase rounded-sm transition-colors">
            <Download className="w-5 h-5" />
            <span>Unduh Proposal Partnership</span>
          </button>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/10 bg-secondary/30 py-12 mb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center border-r border-white/10 last:border-0">
                <h3 className="text-5xl font-heading font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-xs font-button tracking-widest text-supporting uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="container mx-auto px-6 lg:px-12 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Paket Sponsorship</h2>
          <p className="text-supporting font-body">Pilih tingkatan kemitraan yang paling sesuai dengan visi perusahaan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative bg-secondary border p-8 flex flex-col rounded-sm transition-transform hover:-translate-y-2",
                pkg.popular ? "border-accent-primary shadow-[0_0_30px_rgba(200,29,37,0.15)]" : "border-white/10"
              )}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary text-white text-[10px] font-bold font-button tracking-widest px-4 py-1 uppercase rounded-sm">
                  Paling Diminati
                </div>
              )}
              
              <div className={cn("mb-6", pkg.color)}>
                {pkg.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-accent-primary font-mono text-sm mb-6 pb-6 border-b border-white/10">{pkg.price}</p>
              
              <ul className="flex-grow space-y-4 mb-8">
                {pkg.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0" />
                    <span className="text-supporting font-body text-sm leading-tight">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <button className={cn(
                "w-full py-3 font-button tracking-widest text-sm font-bold uppercase transition-colors rounded-sm",
                pkg.popular ? "bg-accent-primary hover:bg-accent-secondary text-white" : "bg-primary border border-white/20 text-white hover:border-white"
              )}>
                Pilih {pkg.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto bg-secondary border border-white/10 p-8 md:p-12 rounded-sm flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Mari Berdiskusi</h2>
            <p className="text-supporting font-body mb-8">Tinggalkan kontak perwakilan Anda, tim Sponsorship kami akan segera menghubungi Anda dengan penawaran terbaik.</p>
            <div className="grid grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Dummy partner logos placeholder */}
              <div className="h-12 bg-primary border border-white/10 rounded-sm flex items-center justify-center text-xs font-mono text-supporting">Partner A</div>
              <div className="h-12 bg-primary border border-white/10 rounded-sm flex items-center justify-center text-xs font-mono text-supporting">Partner B</div>
              <div className="h-12 bg-primary border border-white/10 rounded-sm flex items-center justify-center text-xs font-mono text-supporting">Partner C</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <input type="text" placeholder="Nama Perusahaan / Instansi" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
            <input type="text" placeholder="Nama Narahubung (PIC)" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
            <input type="email" placeholder="Email Profesional" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
            <input type="tel" placeholder="Nomor Telepon / WhatsApp" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
            <button className="w-full bg-white text-primary hover:bg-gray-200 py-4 font-button tracking-widest text-sm font-bold uppercase rounded-sm transition-colors mt-4">
              Kirim Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}