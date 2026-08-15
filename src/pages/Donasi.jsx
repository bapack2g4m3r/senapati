import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const donationOptions = [
  { value: 25000, label: 'Rp 25.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 250000, label: 'Rp 250.000' },
];

export default function Donasi() {
  const [amount, setAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const target = 25000000;
  const collected = 10500000;
  const percentage = (collected / target) * 100;

  const handleSelectAmount = (val) => {
    setIsCustom(false);
    setAmount(val);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Info Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block flex items-center">
              <Heart className="w-4 h-4 mr-2" /> DUKUNG SENAPATI
            </span>
            <h1 className="text-4xl md:text-5xl font-heading-alt font-bold text-white leading-tight">
              1 Alumni = <br />1 Kontribusi
            </h1>
            <p className="text-supporting font-body text-lg leading-relaxed">
              Dukungan Anda menghidupkan kembali panggung-panggung kami. Dana yang terkumpul akan dialokasikan untuk pementasan, festival, workshop, regenerasi anggota, dan pengembangan organisasi Teater Senapati.
            </p>

            <div className="bg-secondary border border-white/5 p-6 rounded-sm mt-8">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs font-button tracking-widest text-supporting uppercase">Dana Terkumpul</p>
                  <p className="text-2xl font-heading font-bold text-white">{formatCurrency(collected)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-button tracking-widest text-supporting uppercase">Target</p>
                  <p className="text-lg font-heading text-white">{formatCurrency(target)}</p>
                </div>
              </div>
              
              <div className="w-full h-2 bg-primary rounded-full overflow-hidden mb-2 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-accent-primary"
                />
              </div>
              <p className="text-right text-xs text-supporting font-mono">{percentage.toFixed(1)}% Tercapai</p>
            </div>
          </motion.div>

          {/* Donation Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-secondary border border-white/10 p-8">
            <h3 className="text-xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-4">Pilih Nominal Donasi</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {donationOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectAmount(opt.value)}
                  className={cn(
                    "py-4 text-sm font-button tracking-widest rounded-sm transition-all border",
                    !isCustom && amount === opt.value 
                      ? "bg-accent-primary border-accent-primary text-white" 
                      : "bg-primary border-white/10 text-supporting hover:border-white/30"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <button 
                onClick={() => { setIsCustom(true); setAmount(0); }}
                className="text-xs font-button tracking-widest text-supporting uppercase mb-2 hover:text-white transition-colors"
              >
                Atau masukkan nominal bebas
              </button>
              {isCustom && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-body">Rp</span>
                  <input 
                    type="number" 
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(Number(e.target.value));
                    }}
                    placeholder="0"
                    className="w-full bg-primary border border-accent-primary text-white pl-12 pr-4 py-4 font-body focus:outline-none rounded-sm text-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Nama Lengkap (Atau Hamba Allah)" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
              <input type="email" placeholder="Email untuk bukti donasi" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm rounded-sm" />
              <textarea placeholder="Pesan dukungan (Opsional)" className="w-full bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors text-sm min-h-[80px] rounded-sm" />
            </div>

            <button className="w-full flex items-center justify-center space-x-2 bg-accent-primary hover:bg-accent-secondary text-white py-4 font-button tracking-widest text-sm rounded-sm transition-colors uppercase">
              <span>Lanjutkan Pembayaran</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}