import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import AlertModal from '../components/ui/AlertModal';
import { ChevronRight, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const steps = [
  { id: 1, title: 'Informasi Pribadi' },
  { id: 2, title: 'Informasi Keanggotaan' },
  { id: 3, title: 'Informasi Angkatan' },
  { id: 4, title: 'Keahlian & Minat' },
  { id: 5, title: 'Profil Profesional' }
];

export default function Register() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'error' });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', nickname: '', dob: '', gender: '',
    memberType: '', 
    yearJoined: '', generationNumber: '',
    skills: [],
    profession: '', workplace: '', country: 'Indonesia', provinceId: '', provinceName: '', city: '', instagram: '', linkedin: '', biography: '',
    email: '', password: ''
  });

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.provinceId}.json`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [formData.provinceId]);

  const showAlert = (message, type = 'error') => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.nickname || !formData.email || !formData.password || !formData.dob || !formData.gender) {
        showAlert(t('Mohon lengkapi semua data pada Informasi Pribadi terlebih dahulu.'));
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.memberType) {
        showAlert(t('Mohon pilih Status Keanggotaan.'));
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.generationNumber || !formData.yearJoined) {
        showAlert(t('Mohon lengkapi Angkatan dan Tahun Bergabung.'));
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Step 5
    if (!formData.profession || !formData.city) {
      showAlert(t('Mohon lengkapi Profesi dan Kota Domisili.'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Gagal mendapatkan User ID");

      // 2. Insert into users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          full_name: formData.fullName,
          nickname: formData.nickname,
          email: formData.email,
          role: 'user'
        });

      if (userError) throw userError;

      // 3. Insert into members table
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: userId,
          member_status: formData.memberType,
          generation_number: parseInt(formData.generationNumber) || null,
          join_year: parseInt(formData.yearJoined) || null,
          skills: formData.skills,
          profession: formData.profession,
          city: formData.city,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          biography: formData.biography,
          approved: false // Requires admin approval
        });

      if (memberError) throw memberError;

      setIsSuccess(true);
    } catch (error) {
      console.error('Registration error details:', error);
      showAlert(error.message || t('Terjadi kesalahan saat pendaftaran.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary p-12 max-w-lg w-full text-center border border-white/10"
        >
          <div className="w-20 h-20 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-heading-alt font-bold text-white mb-4">{t('Pendaftaran Berhasil')}</h2>
          <p className="text-supporting mb-8 font-body leading-relaxed">
            {t('Terima kasih telah mendaftar,')} {formData.nickname}. {t('Data Anda sedang diproses oleh pengurus untuk tahap verifikasi. Silakan cek email Anda atau login ke Dashboard.')}
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-accent-primary text-white font-button text-sm tracking-widest hover:bg-accent-secondary transition-colors uppercase w-full rounded-sm"
          >
            {t('Lanjut ke Dashboard')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-primary px-6 lg:px-12 pb-20">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="text-accent-primary font-button tracking-widest text-sm mb-2 block">{t('BERGABUNG')}</span>
          <h1 className="text-3xl md:text-4xl font-heading-alt font-bold text-white">{t('Registrasi Anggota')}</h1>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-accent-primary z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={cn(
                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-button text-xs font-bold transition-colors duration-300",
                currentStep >= step.id ? "bg-accent-primary text-white" : "bg-secondary text-supporting border border-white/20"
              )}
            >
              {step.id}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-secondary p-8 md:p-12 border border-white/5">
          <h2 className="text-2xl font-heading font-bold text-white mb-8 border-b border-white/10 pb-4">
            {t(steps[currentStep - 1].title)}
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Nama Lengkap" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    <Input label="Nama Panggilan" name="nickname" value={formData.nickname} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Email Akun" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    <div className="flex flex-col space-y-2 w-full relative">
                      <label className="text-xs text-supporting font-button tracking-widest uppercase">Password Akun</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full pr-12"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-supporting hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Tanggal Lahir" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                    <Select label="Jenis Kelamin" name="gender" value={formData.gender} onChange={handleInputChange} options={['Laki-laki', 'Perempuan']} />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <Select 
                    label="Status Keanggotaan" 
                    name="memberType" 
                    value={formData.memberType} 
                    onChange={handleInputChange} 
                    options={['Anggota Aktif', 'Alumni', 'Pengurus', 'Relawan', 'Mitra']} 
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                      label="Angkatan Ke-" 
                      name="generationNumber" 
                      value={formData.generationNumber} 
                      onChange={handleInputChange} 
                      options={Array.from({ length: 25 }, (_, i) => (i + 1).toString())}
                    />
                    <Select 
                      label="Tahun Bergabung" 
                      name="yearJoined" 
                      value={formData.yearJoined} 
                      onChange={handleInputChange} 
                      options={Array.from({ length: new Date().getFullYear() - 2001 }, (_, i) => (new Date().getFullYear() - i).toString())}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-supporting text-sm mb-4">Pilih keahlian dan minat utama Anda (bisa lebih dari satu):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Keaktoran', 'Penyutradaraan', 'Penulisan Naskah', 'Musik & Komposisi', 'Tata Panggung', 'Fotografi', 'Videografi', 'Tata Busana', 'Public Speaking', 'IT & Software', 'Digital Marketing', 'Desain Grafis', 'Manajemen Bisnis'].map(skill => (
                      <label key={skill} className="flex items-center space-x-3 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 border flex items-center justify-center transition-colors",
                          formData.skills.includes(skill) ? "bg-accent-primary border-accent-primary" : "border-white/20 group-hover:border-white/50"
                        )}>
                          {formData.skills.includes(skill) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-body text-supporting group-hover:text-white transition-colors">{skill}</span>
                        <input type="checkbox" className="hidden" checked={formData.skills.includes(skill)} onChange={() => handleSkillToggle(skill)} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                      label="Profesi Saat Ini" 
                      name="profession" 
                      value={formData.profession} 
                      onChange={handleInputChange} 
                      options={['Pelajar/Mahasiswa', 'Pegawai Negeri Sipil (PNS)', 'TNI/POLRI', 'Karyawan Swasta', 'Karyawan BUMN/BUMD', 'Wiraswasta/Pengusaha', 'Pekerja Lepas (Freelance)', 'Pensiunan', 'Mengurus Rumah Tangga', 'Belum/Tidak Bekerja', 'Lainnya']}
                    />
                    <Input label="Institusi / Tempat Kerja" name="workplace" value={formData.workplace} onChange={handleInputChange} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                      label="Negara" 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange} 
                      options={['Indonesia', 'Luar Negeri']}
                    />
                    {formData.country === 'Indonesia' ? (
                      <div className="flex flex-col space-y-2 w-full">
                        <label className="text-xs text-supporting font-button tracking-widest uppercase">Provinsi</label>
                        <select 
                          className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full appearance-none"
                          name="provinceId"
                          value={formData.provinceId}
                          onChange={(e) => {
                            const selectedOption = e.target.options[e.target.selectedIndex];
                            setFormData(prev => ({ 
                              ...prev, 
                              provinceId: e.target.value, 
                              provinceName: selectedOption.text,
                              city: '' // reset city when province changes
                            }));
                          }}
                        >
                          <option value="" disabled className="text-supporting/50">Pilih Provinsi</option>
                          {provinces.map(prov => (
                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Input label="Kota & Negara Bagian" name="city" value={formData.city} onChange={handleInputChange} placeholder="Contoh: New York, USA" />
                    )}
                  </div>

                  {formData.country === 'Indonesia' && (
                    <div className="flex flex-col space-y-2 w-full">
                      <label className="text-xs text-supporting font-button tracking-widest uppercase">Kota/Kabupaten Domisili</label>
                      <select 
                        className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full appearance-none"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!formData.provinceId}
                      >
                        <option value="" disabled className="text-supporting/50">{formData.provinceId ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi Terlebih Dahulu'}</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Username Instagram" name="instagram" placeholder="@" value={formData.instagram} onChange={handleInputChange} />
                    <Input label="Profil LinkedIn (URL)" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-supporting font-button tracking-widest uppercase">Biografi Singkat</label>
                    <textarea 
                      name="biography"
                      value={formData.biography}
                      onChange={handleInputChange}
                      placeholder="Contoh: Saya aktif di teater sejak SMA. Pernah menyutradarai 2 pementasan lokal. Sangat tertarik dengan manajemen produksi dan penulisan naskah komedi."
                      className="bg-primary border border-white/10 text-white p-3 font-body focus:outline-none focus:border-accent-primary transition-colors min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={prevStep}
              className={cn(
                "flex items-center px-4 py-2 font-button text-sm tracking-widest transition-colors",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "text-supporting hover:text-white"
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> KEMBALI
            </button>
            
            {currentStep < steps.length ? (
              <button 
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-accent-primary hover:bg-accent-secondary text-white font-button text-sm tracking-widest transition-colors rounded-sm"
              >
                SELANJUTNYA <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center px-8 py-3 bg-accent-primary text-white font-button text-sm tracking-widest transition-colors rounded-sm uppercase",
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-secondary"
                )}
              >
                {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'} <Check className="w-4 h-4 ml-2" />
              </button>
            )}
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

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs text-supporting font-button tracking-widest uppercase">{label}</label>
      <input 
        className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full"
        {...props}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs text-supporting font-button tracking-widest uppercase">{label}</label>
      <select 
        className="bg-primary border border-white/10 text-white px-4 py-3 font-body focus:outline-none focus:border-accent-primary transition-colors w-full appearance-none"
        {...props}
      >
        <option value="" disabled className="text-supporting/50">Pilih opsi</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
