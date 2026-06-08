"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Users, ShieldCheck, ArrowRight, ArrowLeft, Loader2, Trophy, Zap, CheckSquare } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

const TEAM_TYPES = ["Locality Team", "Friends Team", "Corporate Team", "Club Team", "Other"];

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

export default function FootballRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  // Form State
  const [form, setForm] = useState({
    repName: '', contact: '', altContact: '', email: '',
    locality: '', teamType: '',
    teamName: '', capName: '', capContact: ''
  });

  // Declarations State
  const [declarations, setDeclarations] = useState([false, false, false]);

  const isStep1Valid = form.repName && form.contact.length === 10 && form.email.includes('@');
  const isStep2Valid = form.locality && form.teamType;
  const isStep3Valid = form.teamName && form.capName && form.capContact.length === 10;
  const isStep4Valid = declarations.every(Boolean); // All checkboxes must be checked

  const triggerRazorpay = async () => {
    setLoading(true);
    try {
      // 1. Fetch dynamic price from Admin settings
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'FOOTBALL' })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Format phones with +91 for backend storage
      const finalData = {
        ...form,
        contact: `+91${form.contact}`,
        altContact: form.altContact ? `+91${form.altContact}` : '',
        capContact: `+91${form.capContact}`
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "PUNERI MALLUS",
        description: `Registration: ${form.teamName}`,
        order_id: orderData.id,
        theme: { color: "#FF0000" },
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentType: 'FOOTBALL',
                amount: orderData.amount / 100,
                teamData: finalData // Send all form data to backend
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              showAlert("Registration Successful!", "success");
              setStep(5); // Success Screen
            } else {
              throw new Error("Verification failed.");
            }
          } catch (err) {
            showAlert("Error verifying payment.", "error");
          } finally {
            setLoading(false);
          }
        },
        prefill: { email: form.email, contact: form.contact },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      showAlert(err.message || "Failed to initiate payment", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden text-white selection:bg-brandRed/30 pt-32">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[url('/events/eventsback.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-0" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <Trophy size={40} className="text-brandRed mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Tournament <span className="text-brandRed">Entry</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Secure your team's spot</p>
        </div>

        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Progress Bar */}
          {step < 5 && (
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-brandRed' : 'bg-white/10'}`} />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: REP DETAILS */}
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <h3 className="text-xl font-black uppercase italic text-white border-b border-white/5 pb-4">Representative Details</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="text" placeholder="Rep Full Name *" required value={form.repName} onChange={e => setForm({...form, repName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="tel" placeholder="Contact Number *" maxLength={10} required value={form.contact} onChange={e => setForm({...form, contact: e.target.value.replace(/\D/g, '')})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="tel" placeholder="Alt Contact (Optional)" maxLength={10} value={form.altContact} onChange={e => setForm({...form, altContact: e.target.value.replace(/\D/g, '')})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="email" placeholder="Email Address (For Receipts) *" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                </div>

                <button disabled={!isStep1Valid} onClick={() => setStep(2)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-brandRed hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs">
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: LOCALITY */}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white"><ArrowLeft size={18} /></button>
                  <h3 className="text-xl font-black uppercase italic text-white">Origin & Type</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="text" placeholder="Area / Locality Represented *" required value={form.locality} onChange={e => setForm({...form, locality: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <select required value={form.teamType} onChange={e => setForm({...form, teamType: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white appearance-none cursor-pointer">
                      <option value="" disabled>Select Team Type *</option>
                      {TEAM_TYPES.map(type => <option key={type} value={type} className="bg-zinc-900">{type}</option>)}
                    </select>
                  </div>
                </div>

                <button disabled={!isStep2Valid} onClick={() => setStep(3)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-brandRed hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs">
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 3: TEAM DATA */}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white"><ArrowLeft size={18} /></button>
                  <h3 className="text-xl font-black uppercase italic text-white">Squad Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="text" placeholder="Team / Organization Name *" required value={form.teamName} onChange={e => setForm({...form, teamName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white uppercase font-black tracking-widest" />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="text" placeholder="Captain Name *" required value={form.capName} onChange={e => setForm({...form, capName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="tel" placeholder="Captain Contact Number *" maxLength={10} required value={form.capContact} onChange={e => setForm({...form, capContact: e.target.value.replace(/\D/g, '')})} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-brandRed text-white" />
                  </div>
                </div>

                <button disabled={!isStep3Valid} onClick={() => setStep(4)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-brandRed hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs">
                  Review & Declare <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 4: DECLARATION & PAY */}
            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <button onClick={() => setStep(3)} className="text-zinc-500 hover:text-white"><ArrowLeft size={18} /></button>
                  <h3 className="text-xl font-black uppercase italic text-white">Declaration *</h3>
                </div>
                
                <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  {[
                    "I confirm that all information provided is accurate.",
                    "I agree to follow the tournament rules and decisions of the organizers.",
                    "I understand that registration does not guarantee participation until confirmed by the organizers."
                  ].map((text, idx) => (
                    <label key={idx} className="flex items-start gap-4 cursor-pointer group">
                      <div className="mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={declarations[idx]} 
                          onChange={(e) => {
                            const newDecs = [...declarations];
                            newDecs[idx] = e.target.checked;
                            setDeclarations(newDecs);
                          }}
                        />
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${declarations[idx] ? 'bg-brandRed border-brandRed' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                          {declarations[idx] && <CheckSquare size={14} className="text-white" />}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-300 leading-relaxed font-medium">{text}</span>
                    </label>
                  ))}
                </div>

                <button 
                  disabled={!isStep4Valid || loading} 
                  onClick={triggerRazorpay} 
                  className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-[0_0_30px_rgba(255,0,0,0.3)] active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <>Secure Spot <Zap size={14} fill="currentColor" /></>}
                </button>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <ShieldCheck size={40} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-black uppercase italic text-white">Spot Secured</h3>
                <p className="text-zinc-400 text-sm font-medium">Your registration is complete. A confirmation receipt has been sent to your email.</p>
                <button onClick={() => window.location.href = '/'} className="mt-6 text-brandRed font-black uppercase text-[10px] tracking-[0.2em] hover:underline">Return Home</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}