"use client";
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Smartphone, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  // TIMER STATE
  const [timer, setTimer] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Countdown Logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startResendTimer = () => setTimer(60); // 60 seconds

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  const bypassOTP = true; 

  if (step === 1) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      phone: phone, 
      options: {
        data: { 
          first_name: firstName.toUpperCase(),
          last_name: lastName.toUpperCase(),
          full_name: `${firstName} ${lastName}`.toUpperCase(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      // FORCE SIGN OUT: This kills the auto-login session immediately
      await supabase.auth.signOut();

      if (bypassOTP) {
        // Updated message to guide them back to Login
        setMessage('REGISTRATION SUCCESSFUL! Please head back to Login.');
        setLoading(false);
        
        // Optional: Auto-redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);

      } else {
        setStep(2);
        startResendTimer();
        setLoading(false);
      }
    }
  } else {
    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms',
    });
    
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('WELCOME TO THE TRIBE!');
      router.push('/'); 
    }
    setLoading(false);
  }
};

const handleResendOtp = async () => {
  // Only runs if you have enabled Phone Auth in Supabase dashboard
  if (timer > 0) return;
  setLoading(true);
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    setMessage(error.message);
  } else {
    setMessage('OTP resent successfully!');
    startResendTimer();
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image 
          src="/events/signup.jpg" 
          alt="Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-right opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-black/60 lg:hidden" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-8 py-10 md:px-10 md:py-12 rounded-[45px] shadow-2xl overflow-hidden text-left">
          
          <div className="flex justify-center mb-8 relative z-10">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={500} height={150} className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(255,0,0,0.5)]" priority />
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6 text-center text-white">
              {step === 1 ? <>Join the <span className="text-brandRed">Tribe.</span></> : <>Verify <span className="text-brandRed">Phone.</span></>}
            </h2>

            <form onSubmit={handleSignup} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="FIRST NAME" required
                      className="bg-black/40 border border-white/10 p-3.5 rounded-xl font-bold text-[10px] tracking-widest focus:border-brandRed transition-all outline-none text-white"
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input 
                      type="text" placeholder="LAST NAME" required
                      className="bg-black/40 border border-white/10 p-3.5 rounded-xl font-bold text-[10px] tracking-widest focus:border-brandRed transition-all outline-none text-white"
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="tel" placeholder="PHONE NUMBER" required
                      className="w-full bg-black/40 border border-white/10 p-3.5 pl-11 rounded-xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none text-white"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="email" placeholder="EMAIL" required
                      className="w-full bg-black/40 border border-white/10 p-3.5 pl-11 rounded-xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none text-white"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"} placeholder="PASSWORD" required
                      className="w-full bg-black/40 border border-white/10 p-3.5 pl-11 pr-11 rounded-xl font-bold text-[11px] tracking-widest focus:border-brandRed transition-all outline-none text-white"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-brandRed">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase leading-relaxed">
                    OTP sent to <span className="text-white">{phone}</span>
                  </p>
                  
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-brandRed" size={18} />
                    <input 
                      type="text" placeholder="######" required maxLength={6}
                      className="w-full bg-black/60 border border-brandRed/50 p-5 pl-12 rounded-2xl font-black text-xl tracking-[0.5em] focus:border-brandRed transition-all outline-none text-white text-center"
                      value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      disabled={timer > 0 || loading}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        timer > 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-brandRed hover:text-white'
                      }`}
                    >
                      <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
                      {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="text-[9px] font-black text-zinc-500 uppercase hover:text-white">Change Details</button>
                  </div>
                </div>
              )}

              {message && <p className={`text-[9px] font-black uppercase text-center py-1 ${message.includes('success') ? 'text-green-500' : 'text-brandRed'}`}>{message}</p>}

              <button disabled={loading} className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 text-[10px] flex items-center justify-center gap-2">
                {loading ? 'Processing...' : step === 1 ? 'Tap to Verify' : 'Join Tribe'} <ArrowRight size={14} />
              </button>
            </form>

            <div className="mt-8 text-center flex flex-col gap-3">
              <Link href="/auth/login" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-brandRed transition-colors">
                Already a member? <span className="text-white">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}