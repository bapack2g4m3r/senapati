import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
                  {group.name}
                </Link>
              ) : (
                <button className="text-sm font-button tracking-widest text-supporting hover:text-accent-primary transition-colors py-2 flex items-center gap-1">
                  {group.name}
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
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          <Link
            to="/dashboard"
            className="text-sm font-button tracking-widest transition-colors text-supporting hover:text-accent-primary"
          >
            HUB MEMBER
          </Link>

          <Link
            to="/register"
            className="flex items-center space-x-2 border border-accent-primary text-accent-primary px-4 py-2 hover:bg-accent-primary hover:text-white transition-all font-button text-sm tracking-widest rounded-sm"
          >
            <User size={16} />
            <span>BERGABUNG</span>
          </Link>
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
                    {group.name}
                  </Link>
                ) : (
                  <div>
                    <h3 className="text-accent-primary font-button tracking-widest text-lg font-bold mb-2">{group.name}</h3>
                    <div className="flex flex-col pl-4 border-l border-white/10 space-y-3">
                      {group.items.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-supporting font-button tracking-widest hover:text-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className="text-white font-button tracking-widest text-center py-3 border border-white/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                HUB MEMBER
              </Link>
              <Link
                to="/register"
                className="flex justify-center items-center space-x-2 bg-accent-primary text-white px-4 py-3 font-button text-sm tracking-widest rounded-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} />
                <span>BERGABUNG SEKARANG</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
