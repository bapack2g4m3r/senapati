import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Ticket, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const backgrounds = [
  '/images/stage_performance_1786818192677.jpg',
  '/images/musical_performance_1786818204485.jpg',
  '/images/rehearsal_1786818342263.jpg',
  '/images/group_photo_1786818355859.jpg'
];

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {backgrounds.map((bg, index) => (
          <div
            key={bg}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              index === currentBg ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary" />

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center flex flex-col items-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-primary font-button tracking-[0.2em] text-sm md:text-base mb-4 block">25 TAHUN BERKARYA</span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading-alt font-bold mb-6 tracking-wide uppercase text-white drop-shadow-2xl">
              Teater Senapati
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto font-body text-supporting leading-relaxed mb-10 drop-shadow-md">
              Kisah selama 25 tahun. Dari panggung SMA Pasundan 3 Bandung menuju panggung yang lebih luas bagi seni, budaya, dan generasi mendatang.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <Link to="/history" className="px-8 py-4 bg-accent-primary hover:bg-accent-secondary text-white font-button text-sm tracking-widest transition-all w-full sm:w-auto uppercase rounded-sm text-center">
              Jelajahi Perjalanan
            </Link>
            <Link to="/register" className="px-8 py-4 border border-white/30 hover:border-white hover:bg-white/10 text-white font-button text-sm tracking-widest transition-all w-full sm:w-auto uppercase rounded-sm backdrop-blur-sm text-center">
              Bergabung
            </Link>
            <Link to="/donasi" className="px-8 py-4 border border-white/30 hover:border-white hover:bg-white/10 text-white font-button text-sm tracking-widest transition-all w-full sm:w-auto uppercase rounded-sm backdrop-blur-sm text-center">
              Dukung Kami
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary border-t border-white/5 relative z-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10">
            <StatCard icon={<Heart className="w-8 h-8 text-accent-primary mb-4" />} number="25+" label="Tahun Berkarya" delay={0.1} />
            <StatCard icon={<Users className="w-8 h-8 text-accent-primary mb-4" />} number="500+" label="Alumni" delay={0.2} />
            <StatCard icon={<Ticket className="w-8 h-8 text-accent-primary mb-4" />} number="100+" label="Pementasan" delay={0.3} />
            <StatCard icon={<Award className="w-8 h-8 text-accent-primary mb-4" />} number="20+" label="Prestasi" delay={0.4} />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, number, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center justify-center text-center px-4"
    >
      {icon}
      <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">{number}</h3>
      <p className="text-supporting font-button text-xs tracking-widest uppercase">{label}</p>
    </motion.div>
  );
}
