import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Allow username login (e.g. 'mimin') by auto-appending domain if no @ is present
      const loginEmail = email.includes('@') ? email : `${email}@senapati.com`;

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) throw error;
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Gagal login: Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-secondary border border-white/10 p-8 md:p-10 rounded-sm shadow-2xl relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-heading-alt font-bold text-white mb-2">Login</h1>
          <p className="text-supporting font-body text-sm">Masuk ke akun Teater Senapati Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-body rounded-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-supporting font-button tracking-widest uppercase">Email atau Username</label>
            <input 
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full"
              placeholder="Masukkan email atau username"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-supporting font-button tracking-widest uppercase">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full"
              placeholder="Masukkan password"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center space-x-2 bg-accent-primary hover:bg-accent-secondary text-white py-3 font-button text-sm tracking-widest transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10 border-t border-white/10 pt-6">
          <p className="text-supporting font-body text-sm mb-2">Belum punya akun?</p>
          <Link to="/register" className="text-accent-primary font-button text-sm tracking-widest hover:text-white transition-colors">
            DAFTAR SEKARANG
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
