"use client";
import { useState, useRef, useMemo, useEffect } from 'react';
import { Crown, CheckCircle2, ArrowRight, ShieldCheck, Loader2, Mail, MapPin, Calendar as CalendarIcon, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '@/context/AlertContext';
import { createBrowserClient } from '@supabase/ssr';
import TribeCalendar from '@/components/ui/TribeCalendar';

interface MembershipCardProps {
  price: number;
  benefits: string[];
  userId: string;
  userEmail?: string;
}

const PUNE_AREAS = ["Akurdi", "Aundh", "Balewadi", "Baner", "Bavdhan", "Bhosari", "Bibwewadi", "Camp", "Chikhali", "Chinchwad", "Dapodi", "Deccan", "Dhanori", "Erandwane", "Fatima Nagar", "Ghorpadi", "Hadapsar", "Hinjewadi", "Kalyani Nagar", "Karve Nagar", "Kasarwadi", "Katraj", "Khadki", "Kondhwa", "Koregaon Park", "Kothrud", "Lohegaon", "Magarpatta", "Model Colony", "Moshi", "Mundhwa", "NIBM", "Nigdi", "Pashan", "Phugewadi", "Pimpri", "Pimple Gurav", "Pimple Nilakh", "Pimple Saudagar", "Pune City", "Punawale", "Rahatani", "Ravet", "Sadashiv Peth", "Sahakar Nagar", "Sangvi", "Shivajinagar", "Sinhagad Road", "Sus", "Swargate", "Talawade", "Tathawade", "Thergaon", "Undri", "Viman Nagar", "Vishrantwadi", "Wakad", "Wanowrie", "Warje", "Yerwada"].sort();

export default function MembershipCard({ price, benefits, userId, userEmail }: MembershipCardProps) {
  const [upgrading, setUpgrading] = useState(false);
  const [step, setStep] = useState<1 | 1.5 | 2>(1); 
  const { showAlert } = useAlert();
  
  const initialEmail = userEmail?.includes('@punerimallus.com') ? '' : (userEmail || '');

  const [email, setEmail] = useState(initialEmail);
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [profession, setProfession] = useState('');
  
  const [showCalendar, setShowCalendar] = useState(false);
  const dateContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const maxDobDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    return date.toISOString().split("T")[0];
  }, []);

  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && dob && location && profession;
  }, [email, dob, location, profession]);

  const displayBenefits = benefits.length > 0 ? benefits : [
    "Lifetime Inner Circle Access",
    "VIP Access to Offline Events",
    "Priority Directory Listings",
    "Exclusive Community Offers",
    "Verified Member Badge"
  ];

  // CROSS-DEVICE SYNC HOOK
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 1.5) {
      interval = setInterval(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email === email.trim().toLowerCase()) {
          clearInterval(interval);
          setStep(2);
          showAlert("Identity Verified! Initiating secure payment gateway...", "success");
          setTimeout(() => { triggerRazorpay(); }, 1000);
        }
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [step, email, supabase]);

  const handleDataSaveAndProceed = async () => {
    if (!userId) {
      showAlert("Identity Required. Please login.", "error");
      return;
    }
    
    setUpgrading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      const { error: authError } = await supabase.auth.updateUser({ email: cleanEmail });
      if (authError) throw new Error(authError.message);

      const { error: profileError } = await supabase.from('profiles').update({ 
        email: cleanEmail,
        dob: dob,
        location: location,
        profession: profession.toUpperCase()
      }).eq('id', userId);
      if (profileError) throw profileError;

      const { error: membershipError } = await supabase.from('memberships').upsert({
        user_id: userId,
        email: cleanEmail,
        dob: dob,
        location: location,
        profession: profession.toUpperCase(),
        status: 'PENDING'
      }, { onConflict: 'user_id' }); 

      if (membershipError) throw membershipError;
      
      setStep(1.5);

    } catch (err: any) {
      showAlert(err.message || "Failed to save details.", "error");
      setUpgrading(false);
    }
  };

  const triggerRazorpay = async () => {
    setUpgrading(true);
    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'LIFETIME', amount: price })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "PUNERI MALLUS",
        description: "Lifetime Inner Circle Access",
        order_id: orderData.id,
        method: { netbanking: true, card: true, upi: true, wallet: true, emi: false, paylater: false },
        config: { display: { sequence: ['block.banks', 'block.cards'], preferences: { show_default_blocks: true } } },
        handler: async function (response: any) {
          // 🔥 Turn the spinner back ON while the backend verifies the payment
          setUpgrading(true); 
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: userId,
                paymentType: 'LIFETIME', 
                plan: 'LIFETIME',
                amount: price
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              showAlert("Welcome to the Inner Circle!", "success");
              // Route directly to profile to force a clean, instant UI refresh
              window.location.href = '/profile'; 
            } else {
              setUpgrading(false);
              showAlert("Verification failed. Please contact support.", "error");
            }
          } catch (err) {
            setUpgrading(false);
            showAlert("Error verifying payment.", "error");
          }
        },
        prefill: { email: email },
        theme: { color: "#FF0000" },
        modal: { ondismiss: () => setUpgrading(false) } // Only stops spinning if user manually closes Razorpay
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      showAlert(err.message || "Checkout failed", "error");
      setUpgrading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group shadow-2xl"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brandRed/10 blur-[120px] rounded-full group-hover:bg-brandRed/20 transition-all duration-700" />
      
      <div className="relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-brandRed rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.3)] shrink-0">
              <Crown className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Lifetime Membership</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brandRed">Official Tribe Protocol</p>
            </div>
          </div>
          <div className="bg-black/40 px-5 py-2.5 rounded-2xl border border-white/5 text-right md:w-auto w-fit">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">One-Time Due</p>
            <h4 className="text-3xl font-black italic text-white uppercase tracking-tighter">
              ₹{price}<span className="text-brandRed text-sm not-italic">.00</span>
            </h4>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: DATA COLLECTION */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6 hidden lg:block">
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tight text-white italic">Unlock Your Tribe</h4>
                  <p className="text-xs text-zinc-400 font-medium">Join the inner circle and get lifetime access to premium features.</p>
                </div>
                <div className="space-y-4">
                  {displayBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 shrink-0 bg-brandRed/20 p-1 rounded-full">
                        <Zap size={12} className="text-brandRed" />
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-tight text-zinc-300 leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 lg:border-l lg:border-white/5 lg:pl-10">
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tight text-white italic">Identity Details</h4>
                  <p className="text-xs text-zinc-400 font-medium">Required to activate your membership.</p>
                </div>

                <div className="space-y-3">
                  {/* 1. EMAIL */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={16} />
                    <input type="email" placeholder="Email Address" required className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl font-medium text-[13px] focus:border-brandRed outline-none text-white placeholder:text-zinc-500 transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  {/* 2. BIRTH DATE (Moved Up) */}
                  <div className="relative" ref={dateContainerRef}>
                    <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-white/30 transition-colors h-full" onClick={() => setShowCalendar(!showCalendar)}>
                      <CalendarIcon size={16} className={dob ? "text-brandRed" : "text-zinc-500"} />
                      <span className={`font-medium text-[13px] truncate ${dob ? "text-white" : "text-zinc-500"}`}>{dob ? new Date(dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Birth Date"}</span>
                    </div>
                    <AnimatePresence>
                      {showCalendar && (
                        <TribeCalendar value={dob} onChange={(date) => { setDob(date); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} maxDate={maxDobDate} defaultDate={maxDobDate} anchorRef={dateContainerRef} />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. PROFESSION */}
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={16} />
                    <input type="text" placeholder="Profession" required className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl font-medium text-[13px] focus:border-brandRed outline-none text-white placeholder:text-zinc-500 transition-colors uppercase" value={profession} onChange={(e) => setProfession(e.target.value)} />
                  </div>

                  {/* 4. LOCATION */}
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={16} />
                    <select required className="w-full bg-black/60 border border-white/10 p-4 pl-12 rounded-2xl font-medium text-[13px] focus:border-brandRed outline-none text-white appearance-none cursor-pointer transition-colors" value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="" disabled>Select Area (Pune)</option>
                      {PUNE_AREAS.map(area => <option key={area} value={area} className="bg-zinc-900">{area}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  disabled={!isFormValid || upgrading}
                  onClick={handleDataSaveAndProceed}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-brandRed hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-xs disabled:opacity-50 mt-4"
                >
                  {upgrading ? <Loader2 className="animate-spin" size={16} /> : <>Save & Proceed <ArrowRight size={16} /></>}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1.5: CROSS-DEVICE SYNC WAITING ROOM */}
          {step === 1.5 && (
            <motion.div key="step15" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto py-12 text-center space-y-6">
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
                  Open it on your phone or desktop to continue.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse pt-4">
                <Loader2 size={14} className="animate-spin" /> Waiting for Verification...
              </div>
            </motion.div>
          )}

          {/* STEP 2: PAYMENT OVERVIEW */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto space-y-8 py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-white italic">Identity Verified</h4>
                <p className="text-xs text-zinc-400 font-medium">Complete your payment below to unlock the vault.</p>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  disabled={upgrading}
                  onClick={triggerRazorpay}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-brandRed hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-xs disabled:opacity-50"
                >
                  {upgrading ? <Loader2 className="animate-spin" size={16} /> : <>Pay Securely <ArrowRight size={16} /></>}
                </button>
                
                <div className="flex items-center justify-center gap-2 opacity-40">
                  <ShieldCheck size={14} className="text-zinc-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Razorpay Verified Gateway</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}