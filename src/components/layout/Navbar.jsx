import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const navGroups = [
  { name: 'BERANDA', path: '/' },
  { 
    name: 'TENTANG KAMI', 
    items: [
      { name: 'Sejarah', path: '/history' },
      { name: 'Pengurus', path: '/pengurus' }
    ]
  },
  { 
    name: 'KARYA', 
    items: [
      { name: 'Arsip Pementasan', path: '/productions' },
      { name: 'Senapati TV', path: '/tv' },
      { name: 'Digital Museum', path: '/museum' }
    ]
  },
  { 
    name: 'KOMUNITAS', 
    items: [
      { name: 'Hall of Fame', path: '/hall-of-fame' },
      { name: 'Cari Angkatanmu', path: '/cari-angkatan' },
      { name: 'Peta Alumni', path: '/alumni-map' },
      { name: 'Digital Wall', path: '/digital-wall' }
    ]
  },
  { 
    name: 'KEMITRAAN', 
    items: [
      { name: 'Sponsor & Mitra', path: '/sponsor' },
      { name: 'Dukung Kami', path: '/donasi' }
    ]
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5',
      isScrolled ? 'bg-primary/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
    )}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 relative z-50">
          <img src="/images/logo.png" alt="Teater Senapati Logo" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navGroups.map((group) => (
            <div 
              key={group.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(group.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {group.path ? (
                <Link
                  to={group.path}
                  className={cn(
                    'text-sm font-button tracking-widest transition-colors hover:text-accent-primary py-2 flex items-center',
                    location.pathname === group.path ? 'text-accent-primary font-medium' : 'text-supporting'
                  )}
                >
                  {t(group.name)}
                </Link>
              ) : (
                <button className="text-sm font-button tracking-widest text-supporting hover:text-accent-primary transition-colors py-2 flex items-center gap-1">
                  {t(group.name)}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === group.name && "rotate-180")} />
                </button>
              )}

              {/* Dropdown Menu */}
              {group.items && (
                <AnimatePresence>
                  {activeDropdown === group.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-secondary border border-white/10 shadow-2xl py-2 z-50 rounded-sm"
                    >
                      {group.items.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-sm font-button tracking-widest text-supporting hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {t(item.name)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm font-button tracking-widest transition-colors text-supporting hover:text-accent-primary"
              >
                {t('Dashboard')}
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-sm font-button tracking-widest transition-colors text-red-400 hover:text-red-500"
              >
                {t('Logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-5 py-2 text-white hover:text-accent-primary text-sm font-button tracking-widest transition-colors"
              >
                {t('MASUK')}
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-button tracking-widest transition-colors rounded-sm"
              >
                {t('DAFTAR')}
              </Link>
            </div>
          )}

          {/* Language Switch */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-xs font-button tracking-widest text-supporting ml-4"
          >
            <span className={language === 'id' ? 'text-white' : ''}>ID</span>
            <span className="opacity-50">/</span>
            <span className={language === 'su' ? 'text-white' : ''}>SU</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-0 left-0 w-full bg-primary/95 backdrop-blur-xl border-t border-white/10 flex flex-col pt-24 pb-8 px-6 overflow-y-auto z-40"
          >
            {navGroups.map((group) => (
              <div key={group.name} className="mb-4">
                {group.path ? (
                  <Link
                    to={group.path}
                    className="text-white font-button tracking-widest text-lg font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(group.name)}
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-button tracking-widest text-supporting px-4 py-2 opacity-50">
                      {t(group.name)}
                    </div>
                    {group.items.map(item => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                          'text-sm font-button tracking-widest transition-colors px-8 py-2 block',
                          location.pathname === item.path ? 'text-accent-primary' : 'text-white hover:text-accent-primary'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.name)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-white/10 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-xs font-button tracking-widest text-supporting">BAHASA / LANGUAGE</span>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full transition-colors text-xs font-button tracking-widest text-supporting"
                >
                  <span className={language === 'id' ? 'text-white' : ''}>ID</span>
                  <span className="opacity-50">/</span>
                  <span className={language === 'su' ? 'text-white' : ''}>SU</span>
                </button>
              </div>

              {user ? (
                <div className="flex flex-col space-y-4 px-4">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm font-button tracking-widest text-white hover:text-accent-primary"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('Dashboard')}</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-button tracking-widest text-red-400 hover:text-red-500"
                  >
                    {t('Logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full border border-white/20 hover:border-white text-white py-3 rounded-sm font-button tracking-widest transition-colors text-sm"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('MASUK')}</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full bg-accent-primary hover:bg-accent-secondary text-white py-3 rounded-sm font-button tracking-widest transition-colors text-sm"
                  >
                    <span>{t('DAFTAR')}</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
