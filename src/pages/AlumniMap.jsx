import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Globe, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Data for Alumni Distribution
const distributionData = [
  { city: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', count: 320, percentage: 60 },
  { city: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', count: 125, percentage: 25 },
  { city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', count: 30, percentage: 5 },
  { city: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia', count: 20, percentage: 4 },
  { city: 'Lainnya', province: '-', country: 'Global', count: 25, percentage: 6 },
];

const totalAlumni = distributionData.reduce((acc, curr) => acc + curr.count, 0);

export default function AlumniMap() {
  const [activeTab, setActiveTab] = useState('kota');

  return (
    <div className="pt-24 min-h-screen bg-primary pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-4"
          >
            Peta Persebaran Alumni
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-supporting font-body max-w-2xl mx-auto text-lg"
          >
            Keluarga besar Teater Senapati telah tersebar ke berbagai penjuru. Jarak bukan halangan, panggung kita kini adalah dunia.
          </motion.p>
        </div>

        {/* Stats Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-secondary border border-white/10 p-6 flex flex-col items-center text-center rounded-sm">
            <Users className="w-8 h-8 text-accent-primary mb-4" />
            <h3 className="text-4xl font-heading font-bold text-white mb-2">{totalAlumni}</h3>
            <p className="text-sm font-button tracking-widest text-supporting uppercase">Total Alumni Terdata</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-secondary border border-white/10 p-6 flex flex-col items-center text-center rounded-sm">
            <Building2 className="w-8 h-8 text-accent-primary mb-4" />
            <h3 className="text-4xl font-heading font-bold text-white mb-2">24+</h3>
            <p className="text-sm font-button tracking-widest text-supporting uppercase">Kota di Indonesia</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-secondary border border-white/10 p-6 flex flex-col items-center text-center rounded-sm">
            <Globe className="w-8 h-8 text-accent-primary mb-4" />
            <h3 className="text-4xl font-heading font-bold text-white mb-2">5</h3>
            <p className="text-sm font-button tracking-widest text-supporting uppercase">Negara Berbeda</p>
          </motion.div>
        </div>

        {/* Visual Map Area (Placeholder for real Map integration later) */}
        <div className="relative w-full aspect-[21/9] bg-secondary border border-white/10 rounded-sm mb-16 overflow-hidden flex items-center justify-center group">
          {/* Abstract Map Dots Visual */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-0" />
          
          <MapPin className="w-24 h-24 text-white/5 absolute group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10 text-center p-6 bg-primary/80 backdrop-blur-md border border-white/10 rounded-sm">
            <h2 className="text-xl font-heading-alt font-bold text-accent-primary mb-2">Integrasi Peta Global</h2>
            <p className="text-supporting text-sm max-w-sm">
              Infrastruktur database siap untuk integrasi Mapbox/Google Maps di masa mendatang.
            </p>
          </div>
        </div>

        {/* Detailed Data List */}
        <div>
          <div className="flex space-x-4 mb-8 border-b border-white/10 pb-4">
            <button onClick={() => setActiveTab('kota')} className={cn("text-sm font-button tracking-widest pb-4 -mb-4 transition-colors", activeTab === 'kota' ? "text-accent-primary border-b-2 border-accent-primary font-bold" : "text-supporting hover:text-white")}>BERDASARKAN KOTA</button>
            <button onClick={() => setActiveTab('provinsi')} className={cn("text-sm font-button tracking-widest pb-4 -mb-4 transition-colors", activeTab === 'provinsi' ? "text-accent-primary border-b-2 border-accent-primary font-bold" : "text-supporting hover:text-white")}>BERDASARKAN PROVINSI</button>
            <button onClick={() => setActiveTab('negara')} className={cn("text-sm font-button tracking-widest pb-4 -mb-4 transition-colors", activeTab === 'negara' ? "text-accent-primary border-b-2 border-accent-primary font-bold" : "text-supporting hover:text-white")}>BERDASARKAN NEGARA</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distributionData.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-secondary border border-white/5 p-6 hover:border-accent-primary/50 transition-colors rounded-sm flex justify-between items-center"
              >
                <div>
                  <h4 className="text-xl font-heading font-bold text-white mb-1">
                    {activeTab === 'kota' ? item.city : activeTab === 'provinsi' ? item.province : item.country}
                  </h4>
                  <p className="text-xs font-button text-supporting uppercase tracking-widest">
                    {activeTab === 'kota' ? `${item.province}, ${item.country}` : activeTab === 'provinsi' ? item.country : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-heading font-bold text-accent-primary block">{item.count}</span>
                  <span className="text-[10px] font-mono text-supporting">{item.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}