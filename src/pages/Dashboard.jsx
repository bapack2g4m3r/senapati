import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, QrCode, FileText, Calendar, MessageSquare, BookOpen, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);

  // In a real app, we would fetch the user from Supabase Auth and then fetch their profile.
  // For the prototype, we'll mock the logged-in state if no user is found in Supabase.
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch from users and members table
        const { data: profile } = await supabase
          .from('users')
          .select('*, members(*)')
          .eq('id', user.id)
          .single();
        
        setUser(profile || getMockUser());
      } else {
        setUser(getMockUser());
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-secondary border border-white/5 p-6 rounded-sm mb-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary rounded-full overflow-hidden mb-4 border border-white/10">
                <img src={user.photo_url || '/images/stage_performance_1786818192677.jpg'} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white">{user.full_name || 'Member Senapati'}</h2>
              <span className="text-accent-primary font-button text-xs tracking-widest mt-1 mb-4">{user.members?.[0]?.member_status || 'Anggota Aktif'}</span>
              <div className="w-full border-t border-white/5 pt-4">
                <p className="text-supporting text-xs font-button tracking-widest mb-2 uppercase">Nomor Anggota</p>
                <p className="text-white font-mono tracking-widest bg-primary py-2 rounded-sm border border-white/10">TS-{user.members?.[0]?.generation_number || '25'}-042</p>
              </div>
            </div>

            <nav className="flex flex-col space-y-2">
              <SidebarItem icon={<User />} label="Profil Saya" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
              <SidebarItem icon={<QrCode />} label="Kartu Digital" active={activeTab === 'card'} onClick={() => setActiveTab('card')} />
              <SidebarItem icon={<BookOpen />} label="Arsip Naskah" active={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} />
              <SidebarItem icon={<Calendar />} label="Agenda Kegiatan" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
              <SidebarItem icon={<MessageSquare />} label="Forum Diskusi" active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
              <button className="flex items-center space-x-3 px-4 py-3 text-sm font-button tracking-widest transition-colors text-accent-primary hover:bg-accent-primary hover:text-white rounded-sm mt-4 border border-accent-primary">
                <LogOut className="w-4 h-4" /> <span>KELUAR</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-secondary border border-white/5 p-8 min-h-[600px] rounded-sm">
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-4">Profil Saya</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <InfoField label="Nama Lengkap" value={user.full_name} />
                    <InfoField label="Nama Panggilan" value={user.nickname || '-'} />
                    <InfoField label="Email" value={user.email} />
                    <InfoField label="No. Telepon" value={user.phone_number || '-'} />
                    <InfoField label="Angkatan" value={`Ke-${user.members?.[0]?.generation_number || '-'}`} />
                    <InfoField label="Tahun Bergabung" value={user.members?.[0]?.join_year || '-'} />
                  </div>
                  <h3 className="text-sm font-button tracking-widest text-supporting mb-4 uppercase">Keahlian & Minat</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(user.members?.[0]?.skills || ['Keaktoran', 'Public Speaking']).map(skill => (
                      <span key={skill} className="bg-primary border border-white/10 px-3 py-1 text-xs text-white rounded-sm">{skill}</span>
                    ))}
                  </div>
                  <button className="px-6 py-2 bg-primary border border-white/20 text-white font-button text-xs tracking-widest hover:border-white transition-colors">EDIT PROFIL</button>
                </motion.div>
              )}
              
              {activeTab === 'card' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full pt-12">
                  <div className="w-80 h-[500px] bg-primary border border-accent-primary rounded-xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 w-full h-32 bg-accent-primary" />
                    <div className="z-10 text-center mt-6 flex flex-col items-center">
                      <span className="text-white font-heading font-bold text-xl uppercase tracking-widest">Teater Senapati</span>
                      <div className="w-24 h-24 bg-white rounded-full mt-4 border-4 border-primary overflow-hidden">
                        <img src={user.photo_url || '/images/stage_performance_1786818192677.jpg'} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-white mt-4">{user.full_name}</h3>
                      <p className="text-accent-primary text-sm font-button">{user.members?.[0]?.member_status || 'Anggota Aktif'}</p>
                      
                      <div className="mt-8 bg-white p-2 rounded-md">
                        {/* Fake QR Code */}
                        <div className="w-32 h-32 bg-secondary flex items-center justify-center text-supporting text-xs text-center border-4 border-white relative">
                          <QrCode className="w-20 h-20 text-white absolute" />
                        </div>
                      </div>
                      <p className="mt-4 text-supporting font-mono text-xs tracking-widest">TS-{user.members?.[0]?.generation_number || '25'}-042</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {['scripts', 'events', 'forum'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center pt-20">
                  <FileText className="w-16 h-16 text-white/20 mb-4" />
                  <h2 className="text-2xl font-heading text-white mb-2">Fitur Segera Hadir</h2>
                  <p className="text-supporting max-w-md">Modul ini sedang dalam tahap pengembangan dan akan segera tersedia untuk Anda.</p>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 text-sm font-button tracking-widest transition-colors w-full text-left rounded-sm",
        active ? "bg-primary text-white border-l-2 border-accent-primary" : "text-supporting hover:bg-primary/50 hover:text-white"
      )}
    >
      <span className={cn(active ? "text-accent-primary" : "")}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-supporting text-xs font-button tracking-widest mb-1 uppercase">{label}</p>
      <p className="text-white font-body">{value}</p>
    </div>
  );
}

// Helper to provide a mock user if not connected to Supabase
function getMockUser() {
  return {
    id: 'mock-123',
    full_name: 'Budi Santoso',
    nickname: 'Budi',
    email: 'budi@example.com',
    phone_number: '08123456789',
    photo_url: '',
    members: [{
      member_status: 'Alumni',
      generation_number: 12,
      join_year: 2014,
      skills: ['Penyutradaraan', 'Penulisan Naskah', 'Keaktoran']
    }]
  };
}
