"use client";
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session is found, we don't redirect yet because the 
      // recovery link might still be processing the fragment/hash.
      if (session) {
        setCheckingSession(false);
      } else {
        // Give it a second to process the hash from the email link
        setTimeout(() => setCheckingSession(false), 1500);
      }
    };
    checkSession();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Attempting to update the user with the new password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message === "Auth session missing!" 
        ? "Session expired. Please request a new reset link." 
        : error.message
      );
    } else {
      router.push('/profile?message=password-updated');
    }
    setLoading(false);
  };

  if (checkingSession) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-brandRed mb-4" size={40} />
      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Verifying Recovery Token...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Aesthetic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brandRed/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] backdrop-blur-xl relative z-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">New <span className="text-brandRed">Passcode</span></h1>
        <p className="text-zinc-500 text-sm mb-8 font-medium">Create a strong password for your Tribe account.</p>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="password" 
              placeholder="NEW PASSWORD" 
              required
              className="w-full bg-black border border-white/10 p-5 pl-12 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-brandRed text-[10px] font-black uppercase bg-brandRed/10 p-3 rounded-lg border border-brandRed/20">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}