import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function CariAngkatan() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate years from 2002 to 2027
  const years = Array.from({ length: 26 }, (_, i) => 2002 + i);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select(`
            join_year,
            users (
              full_name,
              nickname,
              photo_url
            )
          `)
          .eq('join_year', selectedYear)
          .eq('approved', true);
        
        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [selectedYear]);

  return (
    <div className="pt-24 min-h-screen bg-primary overflow-hidden flex flex-col">
      <div className="container mx-auto px-6 lg:px-12 flex-grow flex flex-col justify-center">
        
        <div className="text-center mb-16 relative z-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading-alt font-bold text-white mb-4"
          >
            Cari Angkatanmu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-supporting font-body max-w-xl mx-auto text-lg"
          >
            25 Tahun. Ratusan Cerita. Satu Keluarga. Temukan kembali angkatanmu dan mari terhubung kembali.
          </motion.p>
        </div>

        {/* Interactive Year Selector */}
        <div className="relative w-full max-w-4xl mx-auto mb-20 z-20">
          <div 
            ref={containerRef}
            className="flex overflow-x-auto space-x-4 md:space-x-8 py-8 scrollbar-hide snap-x px-[30vw] items-end mask-horizontal"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
            }}
          >
            {years.map((year) => (
              <motion.button
                key={year}
                onClick={() => setSelectedYear(year)}
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "snap-center transition-all duration-300 font-heading-alt text-4xl md:text-6xl cursor-pointer flex-shrink-0 select-none",
                  selectedYear === year 
                    ? "text-white font-bold scale-110 drop-shadow-[0_0_15px_rgba(200,29,37,0.8)]" 
                    : "text-white/20 hover:text-white/50"
                )}
              >
                {year}
              </motion.button>
            ))}
          </div>
          
          {/* Timeline Line */}
          <div className="absolute bottom-4 left-0 w-full h-[1px] bg-white/10 -z-10" />
          <div className="absolute bottom-[11px] left-1/2 -translate-x-1/2 w-3 h-3 bg-accent-primary rotate-45" />
        </div>

        {/* Welcome Message */}
        <AnimatePresence mode="wait">
          {selectedYear && (
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl w-full mx-auto bg-secondary/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl -ml-16 -mb-16" />

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-accent-primary mb-2">
                Angkatan {selectedYear}
              </h2>
              
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {members.length > 0 ? (
                    <div className="mb-12">
                      <p className="text-lg font-body text-white/80 mb-8">
                        Keluarga besar Teater Senapati yang sudah mendaftar:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {members.map((member, idx) => (
                          <div key={idx} className="flex flex-col items-center group">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent-primary transition-colors mb-3 bg-primary flex items-center justify-center">
                              {member.users?.photo_url ? (
                                <img src={member.users.photo_url} alt={member.users.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-8 h-8 text-white/20" />
                              )}
                            </div>
                            <h3 className="font-heading-alt font-bold text-white text-sm md:text-base text-center line-clamp-2">
                              {member.users?.nickname || member.users?.full_name}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 mb-8">
                      <p className="text-xl md:text-2xl font-body text-white mb-2">
                        Belum ada yang mendaftar dari angkatan ini.
                      </p>
                      <p className="text-white/60 font-body">
                        Jadilah yang pertama untuk mewakili angkatanmu!
                      </p>
                    </div>
                  )}

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-white/80 mb-6 font-body">Nama kamu belum ada di sini?</p>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 font-button tracking-widest text-sm font-bold hover:bg-gray-200 transition-colors uppercase rounded-sm group relative z-10"
                    >
                      <Users className="w-5 h-5" />
                      <span>Lengkapi Profil</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative background image */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <img src="/images/group_photo_1786818355859.jpg" className="w-full h-full object-cover grayscale" alt="background" />
      </div>
    </div>
  );
}