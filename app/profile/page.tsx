"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Lock, Camera, Check, AlertCircle, 
  MessageSquare, Loader2, Trash2, Users, 
  AlertTriangle, X 
} from 'lucide-react';
import Link from 'next/link';

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

  // NEW STATES FOR UX
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- INTEGRATED AUTH & MONGODB CHECK ---
  useEffect(() => {
    const fetchUserAndStatus = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/auth/login');
          return;
        }

        setUser(user);
        setFullName(user.user_metadata?.full_name || '');
        setIsCommunityActive(false);

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

    fetchUserAndStatus();
  }, [router, supabase]);

  // --- STORAGE UPLOAD LOGIC ---
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

  // --- UPDATED DELETE ACCOUNT LOGIC ---
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
        // Artificial delay for emotional effect to let preloader shine
        setTimeout(() => router.push('/farewell'), 2000);
      } else {
        throw new Error("Failed to wipe record");
      }
    } catch (error: any) {
      alert(error.message);
      setIsPurging(false);
    }
  };

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

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative">
      
      {/* 1. THE PURGING PRELOADER OVERLAY */}
      {isPurging && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <div className="relative">
            <Loader2 className="text-brandRed animate-spin mb-6" size={60} strokeWidth={1} />
            <div className="absolute inset-0 bg-brandRed/20 blur-[60px] rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-[0.3em] text-white">
            Purging <span className="text-brandRed">Identity</span>
          </h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-4">
            Wiping records from the tribe...
          </p>
        </div>
      )}

      {/* 2. THE CUSTOM DELETE DIALOG */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-zinc-950 border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,1)]">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={30} />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">
              The Nuclear <span className="text-red-500">Option</span>
            </h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
              This will permanently delete your profile, bio, and all interactions within the Puneri Mallus tribe. This action is <span className="underline text-white">irreversible</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDeleteAccount} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl">
                Confirm Deletion
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 bg-zinc-900 text-zinc-400 hover:text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all">
                Nevermind, I'll stay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-zinc-900/30 p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brandRed/5 blur-[100px] -z-10" />
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-brandRed overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.2)]">
              {uploading ? (
                <Loader2 className="animate-spin text-brandRed" size={32} />
              ) : user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={50} className="text-zinc-600" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-brandRed p-2.5 rounded-full cursor-pointer hover:scale-110 transition-all border-4 border-black shadow-lg z-10">
              <Camera size={16} className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
            </label>
            {user?.user_metadata?.avatar_url && !uploading && (
              <button onClick={deleteAvatar} className="absolute -top-1 -right-1 bg-zinc-900 p-2.5 rounded-full cursor-pointer hover:bg-brandRed hover:text-white text-zinc-500 transition-all border-4 border-black shadow-lg group-hover:scale-110 z-10">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{fullName || "Tribe Member"}</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center md:justify-start gap-2">
              <Mail size={12} className="text-brandRed" /> {user?.email}
            </p>
          </div>
        </div>

        {/* STATUS MESSAGES */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest ${
            message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brandRed/10 text-brandRed border border-brandRed/20'
          }`}>
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/40 p-8 rounded-[30px] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brandRed mb-6">Identity Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl mt-1 text-sm font-bold focus:border-brandRed outline-none transition-all" />
              </div>
              <button onClick={handleUpdateName} disabled={updating} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brandRed hover:text-white transition-all">
                {updating ? 'Processing...' : 'Update Identity'}
              </button>
            </div>
          </div>
          <div className="bg-zinc-900/40 p-8 rounded-[30px] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brandRed mb-6">Security</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl mt-1 text-sm font-bold focus:border-brandRed outline-none transition-all" />
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={updating} className="w-full py-4 bg-zinc-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                {updating ? 'Processing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>

        {/* COMMUNITY SECTION */}
        <div className="mt-8 bg-zinc-950 border border-white/5 rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 ${isCommunityActive ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-brandRed'}`} />
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isCommunityActive ? 'bg-green-500/10' : 'bg-brandRed/10'}`}>
            {isCommunityActive ? <Users className="text-green-500" size={30} /> : <MessageSquare className="text-brandRed" size={30} />}
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{isCommunityActive ? 'Tribe Member' : 'Community Profile'}</h2>
          
          {isCommunityActive && socialData ? (
            <div className="space-y-8 text-left">
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {socialData.interests.map((tag: string) => (
                  <span key={tag} className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl">{tag}</span>
                ))}
              </div>
              <div className="space-y-1 text-center md:text-left">
                <p className="text-brandRed text-[10px] font-black uppercase tracking-[0.2em]">Profession</p>
                <p className="text-3xl font-black italic uppercase tracking-tighter text-white">{socialData.profession}</p>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Tribe Bio</p>
                <p className="text-zinc-200 text-lg md:text-xl font-medium leading-relaxed italic tracking-tight border-l-2 border-brandRed/30 pl-6 py-2">"{socialData.bio}"</p>
              </div>
              <Link href="/community" className="block pt-6">
                <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all shadow-xl">Enter Tribe Feed</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">Your social presence is currently inactive. Introduce yourself to the tribe to unlock community features.</p>
              <Link href="/community">
                <button className="bg-brandRed text-white px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,0,0,0.2)]">Activate Community Access</button>
              </Link>
            </div>
          )}
        </div>

        {/* DANGER ZONE */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="bg-red-500/5 border border-red-500/10 rounded-[30px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Danger Zone</h3>
              <p className="text-zinc-500 text-xs font-medium">Permanently delete your account and all data.</p>
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