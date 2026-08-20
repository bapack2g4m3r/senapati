import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMembers, setPendingMembers] = useState([]);
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

      // Check if user has role 'admin'
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || userData?.role !== 'admin') {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        fetchPendingMembers();
      }
    } catch (err) {
      console.error('Error checking admin status', err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          users (
            full_name,
            nickname,
            email
          )
        `)
        .eq('approved', false);

      if (error) throw error;
      setPendingMembers(data || []);
    } catch (err) {
      console.error('Error fetching pending members', err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ approved: true })
        .eq('user_id', userId);

      if (error) throw error;
      
      // Remove from list
      setPendingMembers(prev => prev.filter(m => m.user_id !== userId));
      alert('Anggota berhasil diverifikasi!');
    } catch (err) {
      console.error('Error approving member', err);
      alert('Gagal memverifikasi anggota: ' + err.message);
    }
  };

  const handleReject = async (userId) => {
    const confirmReject = window.confirm('Apakah Anda yakin ingin menolak dan menghapus pendaftaran ini?');
    if (!confirmReject) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      // Remove from list
      setPendingMembers(prev => prev.filter(m => m.user_id !== userId));
      alert('Pendaftaran berhasil ditolak.');
    } catch (err) {
      console.error('Error rejecting member', err);
      alert('Gagal menolak anggota: ' + err.message);
    }
  };

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
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Akses Ditolak</h1>
        <p className="text-supporting max-w-md">
          Halaman ini khusus untuk pengurus (Admin). Jika Anda merasa seharusnya memiliki akses ini, silakan hubungi administrator sistem.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-20 px-6 lg:px-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">DASHBOARD PENGURUS</span>
          <h1 className="text-3xl md:text-4xl font-heading-alt font-bold text-white">Verifikasi Anggota Baru</h1>
        </div>

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
      </div>
    </div>
  );
}
