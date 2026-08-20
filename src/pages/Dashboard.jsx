import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, QrCode, FileText, Calendar, MessageSquare, BookOpen, LogOut, Shield, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import AlertModal from '../components/ui/AlertModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'error' });
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    phone_number: '',
    generation_number: '',
    join_year: '',
    skills: []
  });

  const showAlert = (message, type = 'error') => {
    setAlertConfig({ isOpen: true, message, type });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Fetch from users and members table
          const { data: profile, error: dbError } = await supabase
            .from('users')
            .select('*, members(*)')
            .eq('id', authUser.id)
            .single();
          
          if (dbError) throw dbError;
          if (!profile) throw new Error("Profil tidak ditemukan di database.");
          
          setUser(profile);
          setFormData({
            full_name: profile.full_name || '',
            nickname: profile.nickname || '',
            phone_number: profile.phone_number || '',
            generation_number: profile.members?.[0]?.generation_number || '',
            join_year: profile.members?.[0]?.join_year || '',
            skills: profile.members?.[0]?.skills || []
          });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-6 text-center">
        <p className="text-red-400 mb-4">Terjadi kesalahan: {error}</p>
        <p className="text-supporting max-w-md">
          Ini biasanya terjadi jika proses registrasi Anda sebelumnya gagal atau terputus (misalnya karena RLS Error). Silakan hapus akun ini dari Dashboard Supabase Anda (menu Authentication) lalu coba daftar ulang dari awal.
        </p>
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="mt-8 px-6 py-2 border border-white/20 rounded-sm hover:bg-white/10">Kembali ke Login</button>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // 1. Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          nickname: formData.nickname,
          phone_number: formData.phone_number
        })
        .eq('id', user.id);
      
      if (userError) throw userError;

      // 2. Update members table
      if (user.members && user.members.length > 0) {
        const { error: memberError } = await supabase
          .from('members')
          .update({
            generation_number: formData.generation_number ? parseInt(formData.generation_number) : null,
            join_year: formData.join_year ? parseInt(formData.join_year) : null,
            skills: formData.skills
          })
          .eq('user_id', user.id);
        
        if (memberError) throw memberError;
      }

      // 3. Update local state
      setUser(prev => ({
        ...prev,
        full_name: formData.full_name,
        nickname: formData.nickname,
        phone_number: formData.phone_number,
        members: prev.members ? [{
          ...prev.members[0],
          generation_number: formData.generation_number,
          join_year: formData.join_year,
          skills: formData.skills
        }] : []
      }));
      
      setIsEditing(false);
      showAlert('Profil berhasil diperbarui!', 'success');
    } catch (err) {
      console.error('Error saving profile:', err);
      showAlert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const availableSkills = ['Keaktoran', 'Penyutradaraan', 'Penulisan Naskah', 'Tata Panggung', 'Tata Rias & Busana', 'Tata Cahaya', 'Tata Musik', 'Manajemen Produksi', 'IT & Software', 'Digital Marketing', 'Desain Grafis', 'Manajemen Bisnis'];

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-secondary border border-white/5 p-6 rounded-sm mb-6 flex flex-col items-center text-center relative overflow-hidden">
              {user.role === 'admin' && (
                <div className="absolute top-0 right-0 bg-accent-primary text-white text-[10px] font-bold px-3 py-1 font-button tracking-widest rounded-bl-lg">
                  ADMIN
                </div>
              )}
              <div className="w-24 h-24 bg-primary rounded-full overflow-hidden mb-4 border border-white/10">
                <img src={user.photo_url || '/images/stage_performance_1786818192677.jpg'} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white">{user.full_name}</h2>
              <span className="text-accent-primary font-button text-xs tracking-widest mt-1 mb-4">{t(user.members?.[0]?.member_status || 'Anggota')}</span>
              <div className="w-full border-t border-white/5 pt-4">
                <p className="text-supporting text-xs font-button tracking-widest mb-2 uppercase">{t('Nomor Anggota')}</p>
                <p className="text-white font-mono tracking-widest bg-primary py-2 rounded-sm border border-white/10">TS-{user.members?.[0]?.generation_number || '--'}-042</p>
              </div>
            </div>

            <nav className="flex flex-col space-y-2">
              <SidebarItem icon={<User />} label={t('Profil Saya')} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
              <SidebarItem icon={<QrCode />} label={t('Kartu Digital')} active={activeTab === 'card'} onClick={() => setActiveTab('card')} />
              <SidebarItem icon={<BookOpen />} label={t('Arsip Naskah')} active={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} />
              <SidebarItem icon={<Calendar />} label={t('Agenda Kegiatan')} active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
              <SidebarItem icon={<MessageSquare />} label={t('Forum Diskusi')} active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
              
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-button tracking-widest transition-colors w-full text-left rounded-sm text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/20 mt-4"
                >
                  <Shield className="w-5 h-5" />
                  <span>{t('HALAMAN ADMIN')}</span>
                </button>
              )}

              <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-sm font-button tracking-widest transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-sm mt-4 border border-red-500/20">
                <LogOut className="w-4 h-4" /> <span>{t('KELUAR')}</span>
              </button>
            </nav>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="bg-secondary border border-white/5 p-8 min-h-[600px] rounded-sm">
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-heading font-bold text-white">{t('Profil Saya')}</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-primary border border-white/20 text-white font-button text-xs tracking-widest hover:border-white transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" /> {t('EDIT PROFIL')}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Nama Lengkap')}</label>
                          <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body" />
                        </div>
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Nama Panggilan')}</label>
                          <input type="text" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body" />
                        </div>
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Email (Tidak bisa diubah)')}</label>
                          <input type="text" value={user.email} disabled className="w-full bg-primary/50 border border-white/5 text-white/50 px-4 py-2 font-body cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('No. Telepon')}</label>
                          <input type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body" />
                        </div>
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Angkatan (Angka)')}</label>
                          <input type="number" value={formData.generation_number} onChange={e => setFormData({...formData, generation_number: e.target.value})} className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body" />
                        </div>
                        <div>
                          <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Tahun Bergabung')}</label>
                          <input type="number" value={formData.join_year} onChange={e => setFormData({...formData, join_year: e.target.value})} className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-supporting font-button tracking-widest uppercase mb-2 block">{t('Keahlian & Minat')}</label>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills.map(skill => (
                            <button
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              className={cn(
                                "px-3 py-1 text-xs rounded-sm transition-colors border",
                                formData.skills.includes(skill)
                                  ? "bg-accent-primary border-accent-primary text-white"
                                  : "bg-primary border-white/10 text-supporting hover:border-white/30"
                              )}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4 border-t border-white/10">
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="px-6 py-2 bg-accent-primary text-white font-button text-xs tracking-widest hover:bg-accent-secondary transition-colors"
                        >
                          {isSaving ? t('MENYIMPAN...') : t('SIMPAN PERUBAHAN')}
                        </button>
                        <button 
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              full_name: user.full_name || '',
                              nickname: user.nickname || '',
                              phone_number: user.phone_number || '',
                              generation_number: user.members?.[0]?.generation_number || '',
                              join_year: user.members?.[0]?.join_year || '',
                              skills: user.members?.[0]?.skills || []
                            });
                          }}
                          disabled={isSaving}
                          className="px-6 py-2 bg-transparent border border-white/20 text-white font-button text-xs tracking-widest hover:border-white transition-colors"
                        >
                          {t('BATAL')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <InfoField label={t('Nama Lengkap')} value={user.full_name} />
                        <InfoField label={t('Nama Panggilan')} value={user.nickname || '-'} />
                        <InfoField label={t('Email')} value={user.email} />
                        <InfoField label={t('No. Telepon')} value={user.phone_number || '-'} />
                        <InfoField label={t('Angkatan')} value={user.members?.[0]?.generation_number ? `${t('Ke-')}${user.members[0].generation_number}` : '-'} />
                        <InfoField label={t('Tahun Bergabung')} value={user.members?.[0]?.join_year || '-'} />
                      </div>
                      <h3 className="text-sm font-button tracking-widest text-supporting mb-4 uppercase">{t('Keahlian & Minat')}</h3>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {(user.members?.[0]?.skills || []).length > 0 ? (
                          user.members[0].skills.map(skill => (
                            <span key={skill} className="bg-primary border border-white/10 px-3 py-1 text-xs text-white rounded-sm">{skill}</span>
                          ))
                        ) : (
                          <span className="text-supporting text-sm">{t('Belum ada keahlian yang ditambahkan.')}</span>
                        )}
                      </div>
                    </>
                  )}
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
                      <p className="text-accent-primary text-sm font-button">{t(user.members?.[0]?.member_status || 'Anggota Aktif')}</p>
                      
                      <div className="mt-8 bg-white p-2 rounded-md">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-white/20" />
                  </div>
                  <h2 className="text-2xl font-heading text-white mb-2">{t('Fitur Segera Hadir')}</h2>
                  <p className="text-supporting font-body max-w-md">
                    {t('Kami sedang mengembangkan fitur ini untuk meningkatkan pengalaman Anda di Senapati HUB.')}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        message={alertConfig.message}
        type={alertConfig.type}
      />
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
