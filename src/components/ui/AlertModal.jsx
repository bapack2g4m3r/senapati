import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, title, message, type = 'error' }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-10 h-10 text-green-500 mb-4 mx-auto" />;
      case 'info': return <Info className="w-10 h-10 text-blue-500 mb-4 mx-auto" />;
      case 'error': 
      default: return <AlertCircle className="w-10 h-10 text-accent-primary mb-4 mx-auto" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-secondary border border-white/10 p-8 rounded-sm shadow-2xl max-w-sm w-full text-center z-10"
          >
            {getIcon()}
            <h3 className="text-xl font-heading-alt font-bold text-white mb-2">
              {title || (type === 'error' ? 'Perhatian' : type === 'success' ? 'Berhasil' : 'Informasi')}
            </h3>
            <p className="text-supporting font-body text-sm mb-8 leading-relaxed">
              {message}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-transparent border border-white/20 hover:border-white hover:bg-white hover:text-primary text-white py-3 font-button text-xs tracking-widest uppercase transition-colors rounded-sm"
            >
              Mengerti
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
