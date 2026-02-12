"use client";
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Zap, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ArrowUpRight 
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* 1. ATMOSPHERIC BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-brandRed/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="relative z-10 pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          
          {/* LEFT CONTENT */}
          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brandRed/10 border border-brandRed/20 rounded-full">
                <Zap size={14} className="text-brandRed" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brandRed">Connect With Us</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                Get In <br />
                <span className="text-brandRed">Touch.</span>
              </h1>
              <p className="text-zinc-500 font-medium italic text-xl max-w-md">
                Have a query or want to collaborate with the tribe? Drop us a transmission.
              </p>
            </div>

            <div className="space-y-8 pt-6">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-brandRed/50 transition-colors">
                  <Mail className="text-brandRed" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Email Us</p>
                  <p className="text-lg font-bold">punerimallus@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-brandRed/50 transition-colors">
                  <MapPin className="text-brandRed" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Location</p>
                  <p className="text-lg font-bold">Pune, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:w-1/2">
            <div className="bg-zinc-950/50 p-8 md:p-12 rounded-[50px] border border-white/5 backdrop-blur-xl shadow-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="YOUR NAME" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-sm" />
                  <input type="email" placeholder="YOUR EMAIL" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-sm" />
                </div>
                <input type="text" placeholder="SUBJECT" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-sm" />
                <textarea placeholder="YOUR MESSAGE" rows={5} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-sm resize-none"></textarea>
                <button className="w-full bg-brandRed hover:bg-white hover:text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(255,0,0,0.2)] active:scale-95 text-xs">
                  Send Transmission
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* 6. FOOTER */}
      <footer className="py-20 bg-black relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brandRed/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            
            <div className="lg:col-span-5 space-y-8">
              <div className="relative inline-block group text-left">
                <Link href="/">
                  <Image 
                    src="/logo.png" 
                    alt="Puneri Mallus" 
                    width={300} 
                    height={100} 
                    className="h-16 w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]" 
                  />
                </Link>
              </div>

              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight max-w-xs text-left">
                Kerala's <span className="text-brandRed">Heart</span>, <br /> 
                Pune's Soul.
              </h2>

              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: "#" },
                  { icon: Facebook, href: "#" },
                  { icon: MessageCircle, href: "#" }
                ].map((social, i: number) => (
                  <Link 
                    key={i} 
                    href={social.href} 
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-brandRed hover:border-brandRed/50 hover:bg-brandRed/5 transition-all duration-500"
                  >
                    <social.icon size={20} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 text-left">
              <div className="space-y-6">
                <h4 className="text-brandRed font-black uppercase text-[10px] tracking-[0.3em]">Navigation</h4>
                <ul className="space-y-4">
                  {['Home', 'About Us', 'Events', 'Community'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={item === 'About Us' ? '/about' : (item === 'Events' ? '/events' : '/community')} 
                        className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center group w-fit"
                      >
                        {item}
                        <ArrowUpRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-all text-brandRed -translate-y-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-brandRed font-black uppercase text-[10px] tracking-[0.3em]">Connect</h4>
                <ul className="space-y-4">
                  {['Mallu Dial', 'Contact', 'Join Tribe', 'Admin'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={item === 'Contact' ? '/contact' : (item === 'Admin' ? '/admin' : '#')} 
                        className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center group w-fit"
                      >
                        {item}
                        <ArrowUpRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-all text-brandRed -translate-y-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1 space-y-6">
                <h4 className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em]">The Hub</h4>
                <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed tracking-widest">
                  Sign up to get notified about the next drop.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="EMAIL" 
                    className="bg-zinc-900 border border-white/5 rounded-lg px-4 py-2 text-[10px] w-full focus:outline-none focus:border-brandRed/50 transition-all text-white"
                  />
                  <button className="bg-brandRed p-2 rounded-lg hover:bg-white hover:text-black transition-all">
                    <Zap size={14} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">
            <div className="flex items-center gap-6">
              <p>© 2026 PM Community</p>
              <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
            </div>
            <div className="flex gap-2 items-center">
              <MapPin size={12} className="text-brandRed" />
              <span className="text-zinc-400 tracking-widest">Pune, IN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}