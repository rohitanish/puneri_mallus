"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Briefcase } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface OwnerData {
  fullName: string;
  phone: string;
  businessName: string;
  email: string;
}

interface EmailVerificationGateProps {
  userId: string;
  source: 'MALLU_MART' | 'COMMUNITY'; 
  onVerified: (ownerData: OwnerData) => void;
}

export default function EmailVerificationGate({ userId, source, onVerified }: EmailVerificationGateProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); 
  
  // 🔥 Auto-fetched fields (hidden from UI)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // User-entered fields
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- 0. AUTO-FETCH EXISTING PROFILE DATA ---
  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', userId)
        .single();
        
      if (data) {
        setFullName(data.full_name || 'Unknown');
        
        // 🔥 THE FIX: Strip the +91 so only the 10 digits get passed to the forms
        const cleanPhone = data.phone_number ? data.phone_number.replace(/^\+91/, '') : '';
        setPhone(cleanPhone);
      }
    };
    fetchUserData();
  }, [userId, supabase]);

  // --- 1. SEND LINK VIA CUSTOM API ---
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      
      const res = await fetch('/api/business/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          fullName, 
          phone, 
          businessName, 
          email: cleanEmail, 
          source 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send verification link.");
      }
      
      setStep(2); 
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send verification link.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CROSS-DEVICE POLLER (WITH CACHE BUSTER) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 2) {
      interval = setInterval(async () => {
        const cacheBuster = new Date().getTime().toString();

        const { data, error } = await supabase
          .from('directory_owners')
          .select('is_verified')
          .eq('user_id', userId)
          .eq('source', source)
          .neq('full_name', cacheBuster) 
          .single();
        
        if (error) console.error("Poller Check Error:", error.message);

        if (data && data.is_verified === true) {
          clearInterval(interval);
          setStep(3); 

          const cleanEmail = email.trim().toLowerCase();

          setTimeout(() => {
            // Because we cleaned it in step 0, 'phone' is exactly 10 digits here
            onVerified({ fullName, phone, businessName, email: cleanEmail });
          }, 1500);
        }
      }, 3000); 
    }
    
    return () => clearInterval(interval);
  }, [step, email, fullName, phone, businessName, supabase, userId, source, onVerified]);

  return (
    <div className="w-full max-w-lg mx-auto bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brandRed/10 blur-[100px] rounded-full" />
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: COLLECT DATA & SEND LINK */}
        {step === 1 && (
          <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendLink} className="space-y-6 relative z-10">
            <div className="space-y-2 text-center pb-2">
              <div className="w-16 h-16 bg-brandRed/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brandRed/20">
                <ShieldCheck size={28} className="text-brandRed" />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Owner <span className="text-brandRed">Verification.</span></h2>
              <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">Verify identity before listing</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={16} />
                <input type="text" placeholder="Business / Brand Name" required className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-brandRed transition-all font-bold text-[13px]" value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </div>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={16} />
                <input type="email" placeholder="Business Email (Needs Verification)" required className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-brandRed transition-all font-bold text-[13px]" value={email} onChange={e => { setEmail(e.target.value); setErrorMsg(''); }} />
              </div>
              
              {errorMsg && <p className="text-brandRed text-[10px] font-bold uppercase tracking-widest text-center pt-2">{errorMsg}</p>}
            </div>

            <button type="submit" disabled={loading || !email.includes('@') || !businessName} className="w-full bg-brandRed py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-50 text-white mt-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Verify & Continue <ArrowRight size={18} /></>}
            </button>
          </motion.form>
        )}

        {/* STEP 2: WAITING ROOM / POLLER */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-8 text-center space-y-6 relative z-10">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-brandRed/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-zinc-900 border border-brandRed/50 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-brandRed" />
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-black uppercase tracking-tight text-white italic mb-2">Check Your Inbox</h4>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                We sent a secure link to <strong className="text-white">{email}</strong>.<br/>
                Open it to verify your business identity.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse pt-4">
              <Loader2 size={14} className="animate-spin" /> Waiting for Verification...
            </div>
            
            <button type="button" onClick={() => setStep(1)} className="mt-6 w-full text-center text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-widest transition-colors">
              Wrong email? Go Back
            </button>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center space-y-4 relative z-10">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Identity Verified!</h2>
            <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={12} /> Opening Directory Form...
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}