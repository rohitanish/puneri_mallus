"use client";
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for New Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for Confirm Password
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const strongRegex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    if (!strongRegex.test(password)) {
      setError("Password must be at least 8 characters and include a letter, a number, and a special character (!@#$%^&*).");
      setLoading(false);
      return;
    }
    
    const { data, error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message === "Auth session missing!" 
        ? "Session expired. Please request a new reset link." 
        : updateError.message
      );
      setLoading(false);
      return;
    }

    if (data?.user) {
      await supabase
        .from('authorized_admins')
        .update({ requires_password_change: false })
        .eq('id', data.user.id);
    }

    router.push('/admin');
  };

  if (checkingSession) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-brandRed mb-4" size={40} />
      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Verifying Recovery Token...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brandRed/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] backdrop-blur-xl relative z-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Secure <span className="text-brandRed">Access</span></h1>
        <p className="text-zinc-500 text-sm mb-8 font-medium">Create a strong password for your Admin account.</p>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* New Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="NEW PASSWORD" 
              required
              className="w-full bg-black border border-white/10 p-5 pl-12 pr-12 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-brandRed transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="CONFIRM PASSWORD" 
              required
              className="w-full bg-black border border-white/10 p-5 pl-12 pr-12 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-brandRed transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-brandRed text-[10px] font-black uppercase bg-brandRed/10 p-3 rounded-lg border border-brandRed/20 mt-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}