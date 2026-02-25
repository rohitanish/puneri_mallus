"use client";
import { useState } from 'react';
// Corrected import for latest SSR package
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Initialize Supabase Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Storing name in metadata so it's accessible immediately
        data: { full_name: fullName.toUpperCase() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('VIBE CHECK: Verify your email to join!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brandRed/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-[400px] relative z-10 text-center">
        {/* INCREASED LOGO SIZE */}
        <Link href="/" className="inline-block mb-12">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={400} // Increased from 200
            height={120} // Increased from 80
            className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]" 
            priority
          />
        </Link>

        <div className="bg-zinc-950/50 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] shadow-2xl text-left">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
            Join the <span className="text-brandRed">Tribe.</span>
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="text" placeholder="FULL NAME" required
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="email" placeholder="EMAIL" required
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="password" placeholder="PASSWORD" required
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && (
              <p className={`text-[9px] font-black uppercase text-center tracking-widest ${message.includes('VIBE') ? 'text-green-500' : 'text-brandRed'}`}>
                {message}
              </p>
            )}

            <button 
              disabled={loading} 
              className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 text-[10px] flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Secure Membership'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/auth/login" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-brandRed transition-colors">
              Already a member? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}