"use client";
import { useState } from 'react';
import { Mail, MapPin, Send, Loader2, ShieldCheck, MessageCircle, AlertTriangle } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-4">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_25px_#FF0000] z-10" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);

export default function ContactPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 2) return "Please enter your full name.";
    
    // Strict Regex for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    
    if (!formData.subject.trim()) return "Please enter a subject.";
    if (!formData.message.trim() || formData.message.length < 10) return "Please provide a more detailed message (min 10 characters).";
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // 🔥 QA FIX: Run strict validation before calling API
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showAlert("Message sent successfully. We will be in touch!", "success");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error();
      }
    } catch (err) {
      showAlert("Failed to send message. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* 🔥 SAFE GLASS FIX: Hardware Accelerated Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: 'url(/events/contact2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.38,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303] z-[1]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[2]" />
      </div>

      <main className="relative z-10 pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT CONTENT: BRAND & INFO */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-12">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] mb-6 text-glow">
                Get In <br />
                <span className="text-brandRed">Touch.</span>
              </h1>
              
              <p className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] sm:text-sm leading-relaxed max-w-md">
                Have a question or want to collaborate? Drop us a message and our community team will get back to you shortly.
              </p>
            </div>

            {/* WHATSAPP REDIRECTION CARD */}
            <a 
              href="https://wa.me/919175981863" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block max-w-md p-8 bg-zinc-900/60 md:backdrop-blur-2xl border border-white/10 rounded-[40px] group hover:border-green-500/50 transition-all duration-500 shadow-2xl overflow-hidden relative"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity text-green-500">
                 <MessageCircle size={140} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500 group-hover:text-black transition-all">
                  <MessageCircle size={28} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Instant Support</h4>
                  <p className="text-3xl font-black italic uppercase text-white">Chat on <span className="text-green-500">WhatsApp</span></p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-300 uppercase tracking-widest bg-black/40 w-fit px-4 py-2 rounded-full border border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                  Online & Ready to help
                </div>
              </div>
            </a>

            {/* DIRECT COMMS */}
            <div className="grid grid-cols-1 gap-4 max-w-md">
               {/* EMAIL ITEM */}
               <div 
                 className="flex items-center gap-6 p-6 rounded-[30px] bg-zinc-900/40 border border-white/10 md:backdrop-blur-md hover:bg-zinc-800/60 transition-all group"
                 style={{ transform: 'translateZ(0)' }}
               >
                <div className="w-14 h-14 rounded-2xl bg-brandRed/10 border border-brandRed/20 flex items-center justify-center group-hover:bg-brandRed group-hover:text-white transition-all shadow-lg">
                  <Mail className="text-brandRed group-hover:text-white" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Email Us</p>
                  <p className="text-lg font-bold text-white tracking-tight">punerimallus1@gmail.com</p>
                </div>
              </div>

              {/* LOCATION ITEM */}
              <div 
                className="flex items-center gap-6 p-6 rounded-[30px] bg-zinc-900/40 border border-white/10 md:backdrop-blur-md hover:bg-zinc-800/60 transition-all group"
                style={{ transform: 'translateZ(0)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-brandRed/10 border border-brandRed/20 flex items-center justify-center group-hover:bg-brandRed group-hover:text-white transition-all shadow-lg">
                  <MapPin className="text-brandRed group-hover:text-white" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Location</p>
                  <p className="text-lg font-bold uppercase text-white tracking-tight">Pune, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: MEDIUM FORM CARD */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            <div className="relative">
              <div 
                className="bg-zinc-950/80 md:bg-white/[0.03] border border-white/5 p-8 md:p-10 rounded-[50px] md:backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                style={{ transform: 'translateZ(0)' }}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={100} />
                </div>

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                    <input 
                      id="name"
                      type="text" 
                      placeholder="Your Name"
                      autoComplete="name"
                      className="w-full bg-black/40 border border-white/30 p-5 rounded-2xl outline-none focus:border-brandRed transition-colors font-medium text-[15px] placeholder:text-zinc-600"
                      value={formData.name}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({...formData, name: e.target.value});
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                    <input 
                      id="email"
                      type="email" 
                      placeholder="you@example.com"
                      autoComplete="email" 
                      className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-colors font-medium text-[15px] placeholder:text-zinc-600"
                      value={formData.email}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({...formData, email: e.target.value});
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Subject</label>
                    <input 
                      id="subject"
                      type="text"
                      autoComplete="off" 
                      placeholder="How can we help?" 
                      className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-colors font-medium text-[15px] placeholder:text-zinc-600"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({...formData, subject: e.target.value});
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Message</label>
                    <textarea 
                      id="message"
                      placeholder="Type your message here..." 
                      rows={4} 
                      autoComplete="off"
                      className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-colors font-medium text-[15px] resize-none placeholder:text-zinc-600"
                      value={formData.message}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({...formData, message: e.target.value});
                      }}
                    ></textarea>
                  </div>
                  
                  {/* Inline Form Validation Error */}
                  <AnimatePresence>
                    {formError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-brandRed bg-brandRed/10 border border-brandRed/20 p-3 rounded-xl"
                      >
                        <AlertTriangle size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">{formError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    disabled={loading}
                    className="w-full bg-brandRed hover:bg-white hover:text-black py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 text-xs flex items-center justify-center gap-3 mt-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        Send Message <Send size={16} fill="currentColor" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <LaserDivider />
        </div>
      </main>
    </div>
  );
}