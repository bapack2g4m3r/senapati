import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, ShieldAlert, Users, UserCheck, Search, Download, Edit, Trash2, Key, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AlertModal from '../components/ui/AlertModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Admin() {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' or 'manage'
  
  const [pendingMembers, setPendingMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  
  // Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'join_year', direction: 'desc' });
  
  // Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'error' });

  const showAlert = (message, type = 'error') => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/register');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || userData?.role !== 'admin') {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        fetchData();
      }
    } catch (err) {
      console.error('Error checking admin status', err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          users (
            full_name,
            nickname,
            email,
            phone_number
          )
        `);

      if (error) throw error;
      
      setPendingMembers(data.filter(m => !m.approved));
      setAllMembers(data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  // --- Actions ---

  const handleApprove = async (userId) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ approved: true })
        .eq('user_id', userId);

      if (error) throw error;
      
      setPendingMembers(prev => prev.filter(m => m.user_id !== userId));
      setAllMembers(prev => prev.map(m => m.user_id === userId ? { ...m, approved: true } : m));
      showAlert('Anggota berhasil diverifikasi!', 'success');
    } catch (err) {
      showAlert('Gagal memverifikasi anggota: ' + err.message);
    }
  };

  const handleReject = async (userId) => {
    const confirmReject = window.confirm('Apakah Anda yakin ingin menolak dan menghapus pendaftaran ini?');
    if (!confirmReject) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;

      setPendingMembers(prev => prev.filter(m => m.user_id !== userId));
      setAllMembers(prev => prev.filter(m => m.user_id !== userId));
      showAlert('Pendaftaran berhasil ditolak.', 'success');
    } catch (err) {
      showAlert('Gagal menolak anggota: ' + err.message);
    }
  };

  const handleDeleteMember = async (userId) => {
    const confirmDelete = window.confirm('HAPUS PERMANEN: Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;

      setAllMembers(prev => prev.filter(m => m.user_id !== userId));
      showAlert('Anggota berhasil dihapus.', 'success');
    } catch (err) {
      showAlert('Gagal menghapus anggota: ' + err.message);
    }
  };

  const handleResetPassword = async (email) => {
    const confirmReset = window.confirm(`Kirim link reset password ke ${email}?`);
    if (!confirmReset) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      showAlert(`Link reset password telah dikirim ke email: ${email}`, 'success');
    } catch (err) {
      showAlert('Gagal mengirim link reset: ' + err.message);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: editingMember.users.full_name,
          phone_number: editingMember.users.phone_number
        })
        .eq('id', editingMember.user_id);
      
      if (userError) throw userError;

      const { error: memberError } = await supabase
        .from('members')
        .update({
          generation_number: editingMember.generation_number,
          profession: editingMember.profession,
          city: editingMember.city
        })
        .eq('user_id', editingMember.user_id);
      
      if (memberError) throw memberError;

      setAllMembers(prev => prev.map(m => m.user_id === editingMember.user_id ? editingMember : m));
      setEditingMember(null);
      showAlert('Data berhasil diperbarui!', 'success');
    } catch (err) {
      showAlert('Gagal memperbarui data: ' + err.message);
    }
  };

  const exportToCSV = () => {
    if (allMembers.length === 0) return;

    const headers = ['Nama Lengkap', 'Email', 'No Telepon', 'Angkatan', 'Tahun Bergabung', 'Profesi', 'Kota', 'Status'];
    const csvContent = [
      headers.join(','),
      ...processedMembers.map(m => [
        `"${m.users?.full_name || ''}"`,
        `"${m.users?.email || ''}"`,
        `"${m.users?.phone_number || ''}"`,
        `"${m.generation_number || ''}"`,
        `"${m.join_year || ''}"`,
        `"${m.profession || ''}"`,
        `"${m.city || ''}"`,
        `"${m.approved ? 'Terverifikasi' : 'Menunggu'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Anggota_Senapati_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Sorting & Filtering ---

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getWhatsAppLink = (phone) => {
    if (!phone) return null;
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    return `https://wa.me/${cleanPhone}`;
  };

  const processedMembers = allMembers
    .filter(m => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.users?.full_name?.toLowerCase().includes(q) ||
        m.users?.email?.toLowerCase().includes(q) ||
        m.profession?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.key) {
        case 'name':
          aVal = a.users?.full_name?.toLowerCase() || '';
          bVal = b.users?.full_name?.toLowerCase() || '';
          break;
        case 'generation_number':
          aVal = a.generation_number || 0;
          bVal = b.generation_number || 0;
          break;
        case 'profession':
          aVal = a.profession?.toLowerCase() || '';
          bVal = b.profession?.toLowerCase() || '';
          break;
        case 'city':
          aVal = a.city?.toLowerCase() || '';
          bVal = b.city?.toLowerCase() || '';
          break;
        case 'status':
          aVal = a.approved ? 1 : 0;
          bVal = b.approved ? 1 : 0;
          break;
        default:
          aVal = 0; bVal = 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // --- Renders ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center pt-24 pb-20">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-center pt-24 pb-20 px-6">
        <ShieldAlert className="w-16 h-16 text-accent-primary mb-4" />
        <h1 className="text-3xl font-heading font-bold text-white mb-2">{t('Akses Ditolak')}</h1>
        <p className="text-supporting max-w-md">
          {t('Halaman ini khusus untuk pengurus (Admin). Jika Anda merasa seharusnya memiliki akses ini, silakan hubungi administrator sistem.')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-20 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">{t('DASHBOARD PENGURUS')}</span>
            <h1 className="text-3xl md:text-4xl font-heading-alt font-bold text-white">{t('Manajemen Senapati')}</h1>
          </div>
          
          <div className="flex space-x-2 mt-6 md:mt-0 bg-secondary p-1 rounded-sm border border-white/10">
            <button 
              onClick={() => setActiveTab('verify')}
              className={cn(
                "flex items-center px-6 py-2 font-button tracking-widest text-xs transition-colors rounded-sm",
                activeTab === 'verify' ? "bg-accent-primary text-white" : "text-supporting hover:text-white"
              )}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {t('VERIFIKASI')} {pendingMembers.length > 0 && <span className="ml-2 bg-white text-accent-primary px-1.5 rounded-full text-[10px]">{pendingMembers.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={cn(
                "flex items-center px-6 py-2 font-button tracking-widest text-xs transition-colors rounded-sm",
                activeTab === 'manage' ? "bg-accent-primary text-white" : "text-supporting hover:text-white"
              )}
            >
              <Users className="w-4 h-4 mr-2" />
              {t('SEMUA ANGGOTA')}
            </button>
          </div>
        </div>

        {/* TAB VERIFIKASI */}
        {activeTab === 'verify' && (
          <div className="bg-secondary border border-white/5 rounded-sm p-6 md:p-8">
            {pendingMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 font-body text-lg">Tidak ada anggota baru yang menunggu verifikasi.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-supporting font-button tracking-widest text-xs uppercase">
                      <th className="py-4 px-4 font-normal">Nama</th>
                      <th className="py-4 px-4 font-normal">Email</th>
                      <th className="py-4 px-4 font-normal">Status</th>
                      <th className="py-4 px-4 font-normal">Angkatan</th>
                      <th className="py-4 px-4 font-normal text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingMembers.map((member) => (
                      <tr key={member.user_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <p className="text-white font-bold">{member.users?.full_name}</p>
                          <p className="text-supporting text-xs">"{member.users?.nickname}"</p>
                        </td>
                        <td className="py-4 px-4 text-white/80 text-sm">
                          {member.users?.email}
                        </td>
                        <td className="py-4 px-4 text-white/80 text-sm">
                          {member.member_status}
                        </td>
                        <td className="py-4 px-4 text-white/80 text-sm">
                          {member.join_year ? `Ke-${member.generation_number} (${member.join_year})` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {member.users?.phone_number && (
                              <a 
                                href={getWhatsAppLink(member.users.phone_number)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-sm transition-colors"
                                title={`Chat WhatsApp (${member.users.phone_number})`}
                              >
                                <MessageCircle className="w-5 h-5" />
                              </a>
                            )}
                            <button 
                              onClick={() => handleApprove(member.user_id)}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-sm transition-colors"
                              title="Terima"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(member.user_id)}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-sm transition-colors"
                              title="Tolak"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB MANAJEMEN ANGGOTA */}
        {activeTab === 'manage' && (
          <div className="bg-secondary border border-white/5 rounded-sm p-6 md:p-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-supporting" />
                <input 
                  type="text"
                  placeholder="Cari nama, email, kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-primary border border-white/10 text-white pl-10 pr-4 py-2 text-sm font-body focus:border-accent-primary outline-none transition-colors"
                />
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/register');
                    showAlert('Link registrasi berhasil disalin! Bagikan ke calon anggota.', 'success');
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-primary border border-white/10 text-white font-button text-xs tracking-widest hover:border-white transition-colors"
                >
                  <LinkIcon className="w-4 h-4 mr-2" /> COPY LINK DAFTAR
                </button>
                <button 
                  onClick={exportToCSV}
                  className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-accent-primary text-white font-button text-xs tracking-widest hover:bg-accent-secondary transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> EXPORT CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 text-supporting font-button tracking-widest text-xs uppercase bg-primary/50">
                    <th className="py-4 px-4 font-normal cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                      Nama Lengkap {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="py-4 px-4 font-normal cursor-pointer hover:text-white" onClick={() => handleSort('generation_number')}>
                      Angkatan {sortConfig.key === 'generation_number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="py-4 px-4 font-normal cursor-pointer hover:text-white" onClick={() => handleSort('profession')}>
                      Profesi {sortConfig.key === 'profession' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="py-4 px-4 font-normal cursor-pointer hover:text-white" onClick={() => handleSort('city')}>
                      Kota {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="py-4 px-4 font-normal cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="py-4 px-4 font-normal text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {processedMembers.map((member) => (
                    <tr key={member.user_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-sm">
                      <td className="py-3 px-4">
                        <p className="text-white font-bold">{member.users?.full_name}</p>
                        <p className="text-supporting text-xs">{member.users?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {member.generation_number ? `Angkatan ${member.generation_number}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {member.profession || '-'}
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {member.city || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm border",
                          member.approved ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        )}>
                          {member.approved ? 'Terverifikasi' : 'Menunggu'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-1">
                          {member.users?.phone_number && (
                            <a 
                              href={getWhatsAppLink(member.users.phone_number)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-supporting hover:text-green-400 transition-colors"
                              title={`Chat WhatsApp (${member.users.phone_number})`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleResetPassword(member.users?.email)}
                            className="p-2 text-supporting hover:text-white transition-colors"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingMember(member)}
                            className="p-2 text-supporting hover:text-blue-400 transition-colors"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(member.user_id)}
                            className="p-2 text-supporting hover:text-red-400 transition-colors"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {processedMembers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-supporting">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMember && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-secondary border border-white/10 p-6 md:p-8 max-w-lg w-full rounded-sm max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading font-bold text-white">Edit Data Anggota</h3>
                <button onClick={() => setEditingMember(null)} className="text-supporting hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div>
                  <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={editingMember.users.full_name} 
                    onChange={e => setEditingMember({
                      ...editingMember, 
                      users: { ...editingMember.users, full_name: e.target.value }
                    })}
                    className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body focus:border-accent-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">No Telepon</label>
                  <input 
                    type="text" 
                    value={editingMember.users.phone_number || ''} 
                    onChange={e => setEditingMember({
                      ...editingMember, 
                      users: { ...editingMember.users, phone_number: e.target.value }
                    })}
                    className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body focus:border-accent-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">Angkatan Ke-</label>
                    <input 
                      type="number" 
                      value={editingMember.generation_number || ''} 
                      onChange={e => setEditingMember({...editingMember, generation_number: e.target.value})}
                      className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body focus:border-accent-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">Tahun Bergabung</label>
                    <input 
                      type="number" 
                      value={editingMember.join_year || ''} 
                      disabled
                      className="w-full bg-primary/50 border border-white/5 text-supporting px-4 py-2 font-body cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">Profesi</label>
                  <input 
                    type="text" 
                    value={editingMember.profession || ''} 
                    onChange={e => setEditingMember({...editingMember, profession: e.target.value})}
                    className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body focus:border-accent-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-supporting font-button tracking-widest uppercase mb-1 block">Kota</label>
                  <input 
                    type="text" 
                    value={editingMember.city || ''} 
                    onChange={e => setEditingMember({...editingMember, city: e.target.value})}
                    className="w-full bg-primary border border-white/10 text-white px-4 py-2 font-body focus:border-accent-primary outline-none"
                  />
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setEditingMember(null)} className="px-6 py-2 bg-transparent border border-white/20 text-white font-button text-xs tracking-widest hover:border-white transition-colors">
                    BATAL
                  </button>
                  <button type="submit" className="px-6 py-2 bg-accent-primary text-white font-button text-xs tracking-widest hover:bg-accent-secondary transition-colors">
                    SIMPAN PERUBAHAN
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}
