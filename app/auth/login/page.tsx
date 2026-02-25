"use client";
import { useState } from 'react';
// Corrected import for the latest Supabase SSR package
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  // Initialize the browser client with your environment variables
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brandRed/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-[400px] relative z-10 text-center">
        <Link href="/" className="inline-block mb-12">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={400} // Increased from 200
            height={120} // Increased from 80
            className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]" // Increased height from h-16
            priority
          />
        </Link>

        <div className="bg-zinc-950/50 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] shadow-2xl text-left">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
            Welcome <span className="text-brandRed">Back.</span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="EMAIL" 
                required
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="PASSWORD" 
                required
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end px-2">
              <Link 
                href="/auth/forgot-password" 
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-brandRed transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <p className="text-brandRed text-[9px] font-black uppercase tracking-widest text-center">{error}</p>}

            <button 
              disabled={loading} 
              className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 text-[10px] flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Enter Tribe'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              href="/auth/signup" 
              className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-brandRed transition-colors"
            >
              New here? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}