"use client";
import { useState } from 'react';
import { Mail, MapPin, Zap, Loader2, Globe, Users, ShieldCheck, ArrowDownRight } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

export default function ContactPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-4">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_25px_#FF0000] z-10" />
    <div className="absolute w-full h-[80px] bg-brandRed/5 blur-[60px] opacity-70 pointer-events-none" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showAlert("Transmission Received by the Tribe", "success");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error();
      }
    } catch (err) {
      showAlert("Protocol Failure: Message not sent", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* ATMOSPHERIC BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-brandRed/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-20">
          
          {/* LEFT CONTENT: BRAND & INTEL */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandRed opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brandRed"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Nodes Active // Pune Hub</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] mb-6">
                Direct <br />
                <span className="text-brandRed">Access.</span>
              </h1>
              
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm leading-relaxed max-w-md">
                Initialize a secure transmission to our support terminal. Our community operators are standing by.
              </p>
            </div>

            {/* INTEL CARDS (Fills the space) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-950 border border-white/5 rounded-3xl space-y-3">
                <Users className="text-brandRed" size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Tribe Size</h4>
                <p className="text-2xl font-black italic uppercase">10k+ <span className="text-xs text-brandRed">Members</span></p>
              </div>
              <div className="p-6 bg-zinc-950 border border-white/5 rounded-3xl space-y-3">
                <Globe className="text-brandRed" size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Global Reach</h4>
                <p className="text-2xl font-black italic uppercase">Zero <span className="text-xs text-brandRed">Divides</span></p>
              </div>
            </div>

            {/* DIRECT COMMS */}
            <div className="space-y-6">
               <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-white/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-brandRed transition-colors">
                  <Mail className="text-brandRed" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Support Terminal</p>
                  <p className="text-lg font-bold">punerimallus@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-white/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-brandRed transition-colors">
                  <MapPin className="text-brandRed" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Operations Base</p>
                  <p className="text-lg font-bold uppercase">Pune, MH, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: TRANSMISSION FORM */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Floating Decoration */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brandRed/10 blur-3xl -z-10" />
              
              <div className="bg-zinc-950 border border-white/5 p-8 md:p-12 rounded-[60px] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={120} />
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Full Identity</label>
                      <input 
                        required
                        type="text" 
                        placeholder="NAME" 
                        className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-brandRed transition-all font-bold text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Return Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="EMAIL" 
                        className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-brandRed transition-all font-bold text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Inquiry Nature</label>
                    <input 
                      required
                      type="text" 
                      placeholder="SUBJECT" 
                      className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-brandRed transition-all font-bold text-sm"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Transmission Payload</label>
                    <textarea 
                      required
                      placeholder="YOUR MESSAGE..." 
                      rows={6} 
                      className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-brandRed transition-all font-bold text-sm resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <button 
                    disabled={loading}
                    className="w-full bg-brandRed hover:bg-white hover:text-black py-8 rounded-3xl font-black uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(255,0,0,0.2)] active:scale-95 text-xs flex items-center justify-center gap-4"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        Inject Transmission <Zap size={16} fill="currentColor" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
<LaserDivider/>
        </div>
      </main>
    </div>
  );
}