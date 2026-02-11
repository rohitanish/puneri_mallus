"use client";
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      router.push('/profile?message=password-updated');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/40 border border-white/5 p-10 rounded-[40px]">
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

          {error && <p className="text-brandRed text-[10px] font-black uppercase">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all shadow-xl"
          >
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}