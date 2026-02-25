"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Lock, Camera, Check, AlertCircle, 
  Loader2, Users, AlertTriangle, Shield, Edit3, Zap 
} from 'lucide-react';
import Link from 'next/link';
import OnboardingForm from '@/components/community/OnboardingForm';
import { useAlert } from '@/context/AlertContext';
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { showAlert } = useAlert();
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // COMMUNITY STATES
  const [isCommunityActive, setIsCommunityActive] = useState(false);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [socialData, setSocialData] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchUserAndStatus = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      setFullName(user.user_metadata?.full_name || '');

      const res = await fetch(`/api/profile/check?id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setIsCommunityActive(data.exists);
        if (data.exists && data.profile) {
          setSocialData(data.profile);
        }
      }
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndStatus();
  }, []);

  // --- AVATAR LOGIC ---
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const oldUrl = user?.user_metadata?.avatar_url;
      if (oldUrl) {
        const oldPath = oldUrl.split('/avatars/')[1];
        if (oldPath) await supabase.storage.from('avatars').remove([oldPath]);
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      
      setUser((prev: any) => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, avatar_url: publicUrl }
      }));
      setMessage({ type: 'success', text: 'Tribe portrait updated!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  // --- ACCOUNT LOGIC ---
  const handleUpdateName = async () => {
    setUpdating(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.toUpperCase() }
    });
    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: 'Name updated in Tribe records!' });
    setUpdating(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be 6+ characters' });
      return;
    }
    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Security updated!' });
      setNewPassword('');
    }
    setUpdating(false);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    setIsPurging(true);
    try {
      if (user?.user_metadata?.avatar_url) {
        const path = user.user_metadata.avatar_url.split('/avatars/')[1];
        if (path) await supabase.storage.from('avatars').remove([path]);
      }
      const res = await fetch(`/api/profile/delete?id=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        await supabase.auth.signOut();
        setTimeout(() => router.push('/farewell'), 2000); 
      }
    } catch (error: any) {
      showAlert("Purge failed: " + error.message);
      setIsPurging(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-brandRed mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Syncing Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-32 px-6 relative selection:bg-brandRed/30">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brandRed/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brandRed/5 blur-[120px] rounded-full" />
      </div>

      {/* PURGING OVERLAY */}
      {isPurging && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <Loader2 className="text-brandRed animate-spin mb-6" size={60} />
          <h2 className="text-2xl font-black italic uppercase tracking-[0.3em]">Purging <span className="text-brandRed">Identity</span></h2>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-zinc-950 border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-500">
              <AlertTriangle size={30} />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">The Nuclear <span className="text-red-500">Option</span></h3>
            <p className="text-zinc-500 text-sm mb-8 font-medium italic">This will permanently wipe your tribe records. This action is irreversible.</p>
            <div className="space-y-3">
              <button onClick={handleDeleteAccount} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all">Confirm Deletion</button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 bg-zinc-900 text-zinc-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 bg-zinc-950/50 p-10 rounded-[50px] border border-white/5 backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brandRed/5 blur-[100px] -z-10" />
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-zinc-900 border-2 border-brandRed/30 overflow-hidden flex items-center justify-center shadow-2xl">
              {uploading ? (
                <Loader2 className="animate-spin text-brandRed" size={32} />
              ) : user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-zinc-800" />
              )}
            </div>
            <label className="absolute bottom-1 right-1 bg-brandRed p-3 rounded-2xl cursor-pointer hover:scale-110 transition-all border-4 border-black shadow-2xl">
              <Camera size={18} className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none">{fullName || "Tribe Member"}</h1>
            <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center md:justify-start gap-2">
              <Mail size={12} className="text-brandRed" /> {user?.email}
            </p>
          </div>
        </div>

        {/* FEEDBACK MESSAGE */}
        {message.text && (
          <div className={`mb-10 p-5 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border ${
            message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-brandRed/10 text-brandRed border-brandRed/20'
          }`}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* MAIN SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-zinc-950/50 p-10 rounded-[40px] border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <User size={18} className="text-brandRed" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Records</h3>
            </div>
            <div className="space-y-4">
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all uppercase" />
              <button onClick={handleUpdateName} disabled={updating} className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-brandRed hover:text-white transition-all active:scale-95">Update Identity</button>
            </div>
          </div>

          <div className="bg-zinc-950/50 p-10 rounded-[40px] border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <Shield size={18} className="text-brandRed" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Security</h3>
            </div>
            <div className="space-y-4">
              <input type="password" placeholder="NEW PASSWORD" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all" />
              <button onClick={handleChangePassword} disabled={updating} className="w-full py-5 bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95">Change Access</button>
            </div>
          </div>
        </div>

        {/* COMMUNITY SECTION (With Edit Feature) */}
        <div className="bg-zinc-950 border border-white/5 rounded-[50px] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-full h-[2px] ${isCommunityActive ? 'bg-green-500' : 'bg-brandRed'}`} />
          
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              Tribe <span className={isCommunityActive ? 'text-green-500' : 'text-brandRed'}>Identity</span>
            </h2>
            {isCommunityActive && !isEditingIdentity && (
              <button 
                onClick={() => setIsEditingIdentity(true)}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-brandRed transition-all"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>

          {isCommunityActive && socialData && !isEditingIdentity ? (
            /* VIEW MODE */
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <div className="space-y-2">
                  <p className="text-brandRed text-[9px] font-black uppercase tracking-[0.4em]">Profession</p>
                  <p className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">{socialData.profession}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.4em]">Tribe Bio</p>
                  <p className="text-zinc-300 text-xl font-medium italic border-l-4 border-brandRed/20 pl-6 py-2">"{socialData.bio}"</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {socialData.interests.map((tag: string) => (
                  <span key={tag} className="px-5 py-2 bg-zinc-900 border border-white/5 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-xl">#{tag}</span>
                ))}
              </div>

              <Link href="/community" className="block pt-8">
                <button className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase text-[12px] tracking-[0.4em] hover:bg-brandRed hover:text-white transition-all shadow-xl">Open Tribe Hub</button>
              </Link>
            </div>
          ) : (
            /* FORM MODE (Onboarding or Editing) */
            <div className="max-w-2xl mx-auto">
              <OnboardingForm 
                userId={user?.id} 
                initialData={socialData}
                isEditing={isEditingIdentity}
                onCancel={() => setIsEditingIdentity(false)}
                onComplete={(newData) => {
                  setIsCommunityActive(true);
                  setSocialData(newData);
                  setIsEditingIdentity(false);
                  setMessage({ type: 'success', text: 'Tribe Identity Synchronized!' });
                }} 
              />
            </div>
          )}
        </div>

        {/* DANGER ZONE */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-red-900 font-black uppercase text-[10px] tracking-[0.5em] mb-2">The Nuclear Option</h3>
              <p className="text-zinc-700 text-xs font-medium italic leading-relaxed">Deleting your record will permanently remove you from the Puneri Mallus tribe cloud.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="px-10 py-5 border border-red-900/20 hover:bg-red-600 hover:text-white text-red-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Delete Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}