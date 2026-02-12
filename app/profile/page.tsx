"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Lock, Camera, Check, AlertCircle, 
  MessageSquare, Loader2, Trash2, Users, 
  AlertTriangle, X, Shield 
} from 'lucide-react';
import Link from 'next/link';
import OnboardingForm from '@/components/community/OnboardingForm';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCommunityActive, setIsCommunityActive] = useState(false);
  const [socialData, setSocialData] = useState<{
    profession: string;
    bio: string;
    interests: string[];
  } | null>(null);

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
  }, [router, supabase]);

  // --- AVATAR LOGIC ---
  const deleteAvatar = async () => {
    try {
      setUploading(true);
      const currentUrl = user?.user_metadata?.avatar_url;
      if (currentUrl) {
        const path = currentUrl.split('/avatars/')[1];
        if (path) await supabase.storage.from('avatars').remove([path]);
      }
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: null } });
      if (error) throw error;
      setUser((prev: any) => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, avatar_url: null }
      }));
      setMessage({ type: 'success', text: 'Tribe portrait removed.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

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

  // --- PROFILE LOGIC ---
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
    // Wipe storage if it exists
    if (user?.user_metadata?.avatar_url) {
      const path = user.user_metadata.avatar_url.split('/avatars/')[1];
      if (path) await supabase.storage.from('avatars').remove([path]);
    }

    // Call your MongoDB delete API
    const res = await fetch(`/api/profile/delete?id=${user.id}`, { method: 'DELETE' });

    if (res.ok) {
      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      
      // REDIRECT TO FAREWELL PAGE
      // We use a 2-second timeout so the "Purging" loader feels substantial
      setTimeout(() => router.push('/farewell'), 2000); 
    }
  } catch (error: any) {
    alert("Purge failed: " + error.message);
    setIsPurging(false);
  }
};

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-brandRed" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative selection:bg-brandRed/30">
      
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
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={30} />
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

      <div className="max-w-4xl mx-auto">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-zinc-900/30 p-10 rounded-[40px] border border-white/5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brandRed/5 blur-[100px] -z-10" />
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-brandRed overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.2)]">
              {uploading ? (
                <Loader2 className="animate-spin text-brandRed" size={32} />
              ) : user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={50} className="text-zinc-600" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-brandRed p-2.5 rounded-full cursor-pointer hover:scale-110 transition-all border-4 border-black shadow-lg">
              <Camera size={16} className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{fullName || "Tribe Member"}</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Mail size={12} className="text-brandRed" /> {user?.email}
            </p>
          </div>
        </div>

        {/* FEEDBACK MESSAGE */}
        {message.text && (
          <div className={`mb-8 p-5 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border ${
            message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-brandRed/10 text-brandRed border-brandRed/20'
          }`}>
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* MAIN SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/40 p-8 rounded-[30px] border border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <User size={18} className="text-brandRed" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Identity Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Legal Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold focus:border-brandRed outline-none transition-all uppercase" />
              </div>
              <button onClick={handleUpdateName} disabled={updating} className="w-full py-4 bg-white text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-brandRed hover:text-white transition-all active:scale-95">Update Identity</button>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-[30px] border border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={18} className="text-brandRed" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Security Control</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl text-sm font-bold focus:border-brandRed outline-none transition-all" />
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={updating} className="w-full py-4 bg-zinc-800 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-white hover:text-black transition-all active:scale-95">Change Password</button>
            </div>
          </div>
        </div>

        {/* COMMUNITY SECTION (Embedded Onboarding) */}
        <div className="mt-8 bg-zinc-950 border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${isCommunityActive ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-brandRed'}`} />
          
          {isCommunityActive && socialData ? (
            /* VIEW MODE */
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <Users className="text-green-500" size={30} />
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Tribe <span className="text-green-500">Identity</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-white/5 pt-8">
                <div className="space-y-1">
                  <p className="text-brandRed text-[9px] font-black uppercase tracking-[0.2em]">Profession</p>
                  <p className="text-2xl font-black italic uppercase text-white tracking-tight">{socialData.profession}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">Tribe Bio</p>
                  <p className="text-zinc-300 font-medium italic border-l-2 border-brandRed/30 pl-4">"{socialData.bio}"</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center py-4">
                {socialData.interests.map((tag: string) => (
                  <span key={tag} className="px-4 py-1.5 bg-zinc-900 border border-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-xl">#{tag}</span>
                ))}
              </div>

              <Link href="/community" className="block pt-4">
                <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all shadow-xl">Open Tribe Feed</button>
              </Link>
            </div>
          ) : (
            /* FORM MODE */
            <div className="max-w-2xl mx-auto">
              <OnboardingForm 
                userId={user?.id} 
                onComplete={(newData) => {
                  setIsCommunityActive(true);
                  setSocialData(newData);
                  setMessage({ type: 'success', text: 'Tribe Identity Activated! Welcome.' });
                }} 
              />
            </div>
          )}
        </div>

        {/* DANGER ZONE */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="bg-red-500/5 border border-red-500/10 rounded-[30px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Danger Zone</h3>
              <p className="text-zinc-500 text-xs font-medium italic">Deleting your record will permanently remove you from the Puneri Mallus tribe.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="px-8 py-4 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Delete Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}