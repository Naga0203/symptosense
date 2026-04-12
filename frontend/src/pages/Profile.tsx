import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Activity, 
  Shield, 
  Camera,
  Heart,
  Save,
  Loader2,
  ImagePlus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { DEFAULT_AVATARS } from '../constants';
import { logger } from '../utils/logger';
import Loader from '../components/common/Loader';
import AvatarPicker from '../components/common/AvatarPicker';

interface UserProfile {
  fullName: string;
  email: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  sugarLevel: string;
  bp: string;
  location: string;
  profilePic: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    age: '',
    gender: 'male',
    bloodGroup: '',
    sugarLevel: '',
    bp: '',
    location: '',
    profilePic: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.data.profile) {
          setProfile(response.data.profile);
        }
        logger.info('Profile fetched successfully', null, 'Profile');
      } catch (err) {
        logger.error('Failed to fetch profile', err, 'Profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (isEditing) {
      setSaving(true);
      try {
        await authService.updateProfile(profile);
        setIsEditing(false);
        window.dispatchEvent(new Event('profileUpdated'));
        logger.info('Profile updated successfully', null, 'Profile');
      } catch (err) {
        logger.error('Failed to update profile', err, 'Profile');
      } finally {
        setSaving(false);
      }
    } else {
      setIsEditing(true);
      logger.action('Profile edit mode entered');
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setProfile({ ...profile, profilePic: avatarUrl });
    logger.action('Avatar changed via picker', { source: 'AvatarPicker' });
  };

  const currentAvatar = profile.profilePic || DEFAULT_AVATARS[profile.gender] || DEFAULT_AVATARS.other;

  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-6"><Loader /><p className="text-gray-500 font-medium animate-pulse">Syncing Health Passport...</p></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-font">Medical <span className="text-blue-500">Identity</span></h1>
          <p className="text-gray-500 mt-2 font-medium tracking-wide">Secure, persistent health profiling powered by SymptoSense.</p>
        </div>
        <button 
          onClick={handleUpdate}
          disabled={saving}
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center gap-2 ${
            isEditing 
              ? "bg-emerald-500 text-white hover:bg-emerald-400" 
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <><Save className="w-4 h-4" /> Save Passport</> : "Refactor Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-10 rounded-[40px] text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/10 to-indigo-600/10" />
            <div className="relative pt-6">
              <div className="relative inline-block">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="w-44 h-44 rounded-[48px] border-4 border-gray-900 overflow-hidden shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform duration-500"
                >
                  <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setIsAvatarPickerOpen(true)}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                    >
                      <Camera className="w-8 h-8 text-white" />
                      <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change Avatar</span>
                    </motion.div>
                  )}
                </motion.div>
                <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl border-4 border-gray-900 text-white shadow-xl"><Shield className="w-5 h-5" /></div>
              </div>

              {/* Avatar picker trigger (always visible in edit mode) */}
              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-all"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  Choose Avatar
                </motion.button>
              )}

              <div className="mt-6 space-y-2">
                <h2 className="text-3xl font-black text-white heading-font italic tracking-tight">{profile.fullName || 'Anonymous User'}</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 rounded-full text-[10px] font-black uppercase text-blue-400 tracking-widest">Medical ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[40px] border-blue-500/10 bg-blue-500/5">
            <div className="flex items-center gap-3 text-blue-400 mb-6">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="font-extrabold text-sm tracking-[0.2em] uppercase">Vital Sync</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500"><span>Data Integrity</span><span className="text-emerald-500">Secured</span></div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full" /></div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">Automated Firestore synchronization active.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 rounded-[40px] space-y-10">
            <div className="flex items-center gap-4 border-b border-gray-800/40 pb-8">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><User className="w-6 h-6" /></div>
              <h3 className="text-2xl font-black text-white heading-font italic">Identity Attributes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AttributeInput label="Full Identity Name" value={profile.fullName} onChange={(val) => setProfile({...profile, fullName: val})} disabled={!isEditing} />
              <AttributeInput label="Communication Channel" value={profile.email} onChange={(val) => setProfile({...profile, email: val})} disabled={!isEditing} icon={Mail} />
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Gender Designation</label>
                <select disabled={!isEditing} value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value as any})} className="w-full bg-black/40 border-2 border-gray-800/50 rounded-2xl px-6 py-4 text-white font-bold disabled:opacity-40 focus:border-blue-500/50 transition-all outline-none appearance-none cursor-pointer"><option value="male">Male Spectrum</option><option value="female">Female Spectrum</option><option value="other">Non-Binary / Other</option></select>
              </div>
              <AttributeInput label="Cycle Age" value={profile.age} onChange={(val) => setProfile({...profile, age: val})} disabled={!isEditing} icon={Calendar} type="number" />
              <div className="md:col-span-2">
                <AttributeInput label="Geographic Location" value={profile.location} onChange={(val) => setProfile({...profile, location: val})} disabled={!isEditing} icon={MapPin} />
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px] space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
            <div className="flex items-center gap-4 border-b border-gray-800/40 pb-8 relative">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><Activity className="w-6 h-6" /></div>
              <h3 className="text-2xl font-black text-white heading-font italic">Clinical Bio-Markers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <ClinicalStat label="Blood Group" value={profile.bloodGroup} onChange={(v) => setProfile({...profile, bloodGroup: v})} disabled={!isEditing} color="text-red-500" />
                <ClinicalStat label="Blood Pressure" value={profile.bp} onChange={(v) => setProfile({...profile, bp: v})} disabled={!isEditing} color="text-cyan-400" />
                <ClinicalStat label="Sugar Level" value={profile.sugarLevel} onChange={(v) => setProfile({...profile, sugarLevel: v})} disabled={!isEditing} color="text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentAvatar}
      />
    </div>
  );
}

function AttributeInput({ label, value, onChange, disabled, icon: Icon, type = "text" }: any) {
    return (
        <div className="space-y-4 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] group-focus-within:text-blue-400 transition-colors">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-blue-400" />}
                <input type={type} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/40 border-2 border-gray-800/50 rounded-2xl ${Icon ? 'pl-16' : 'px-6'} py-4 text-white font-bold disabled:opacity-40 focus:border-blue-500/50 transition-all outline-none placeholder:text-gray-800`} />
            </div>
        </div>
    );
}

function ClinicalStat({ label, value, onChange, disabled, color }: any) {
    return (
        <div className="p-8 bg-black/40 rounded-[32px] border border-gray-800/50 group hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{label}</p>
            <input 
                disabled={disabled}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="---"
                className={`text-3xl font-black bg-transparent w-full outline-none ${color} transition-all disabled:opacity-80 placeholder:text-gray-800`}
            />
        </div>
    );
}
