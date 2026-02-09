"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ArrowUpRight, 
  MapPin,
  Zap
} from 'lucide-react';
import EventGlimpse from '@/components/EventGlimpse';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-4">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_25px_#FF0000] z-10" />
    <div className="absolute w-full h-[80px] bg-brandRed/5 blur-[60px] opacity-70 pointer-events-none" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);

export default function Home() {
  const [heroVideo, setHeroVideo] = useState(false);

  // Hero Transition (Static to Video once)
  useEffect(() => {
    const timer = setTimeout(() => setHeroVideo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-brandRed/30 relative">
      
      {/* GLOBAL RICH BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brandRed/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brandRed/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10">
        
        {/* 1. HERO SECTION WITH NEW MANTRA & NAVIGATION */}
        <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
            {/* Background Layers */}
            <Image
              src="/hero-bg.jpeg"
              alt="Puneri Mallus"
              fill
              className={`object-cover grayscale-[20%] transition-opacity duration-1000 ${heroVideo ? 'opacity-0' : 'opacity-60'}`}
              priority
            />
            {heroVideo && (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[10%] animate-in fade-in duration-1000">
                <source src="/videos/hero-video.mp4" type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          </div>

          <div className="relative z-20 text-center space-y-12 -mt-20 px-6">
            <div className="flex justify-center">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={600} 
                height={250} 
                className="h-[180px] w-auto object-contain drop-shadow-[0_0_45px_rgba(255,0,0,0.6)]"
              />
            </div>

            {/* THE MANTRA */}
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white/90">
                  One Community <span className="text-brandRed">.</span> Many Dreams
                </h1>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                  <span className="text-brandRed drop-shadow-[0_0_25px_rgba(255,0,0,0.6)]">Zero Divides</span>
                </h2>
                <p className="text-lg md:text-2xl text-zinc-500 font-bold uppercase tracking-[0.7em] pt-4">
                  Together For Growth
                </p>
              </div>
            </div>

            {/* UPDATED CTA BUTTON */}
            <div className="pt-8">
              <Link href="/about">
                <button className="group relative bg-brandRed text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all hover:scale-110 shadow-[0_0_60px_rgba(255,0,0,0.4)]">
                  <span className="relative z-10 flex items-center gap-3">
                    Know More <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  {/* Hover Slide Effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <LaserDivider />

        {/* 2. EVENT GLIMPSE */}
        <section className="py-40 bg-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Event <span className="text-brandRed">Glimpse</span></h2>
              <Link href="/events" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-brandRed transition-all">View All Events</Link>
            </div>
            <EventGlimpse />
          </div>
        </section>

        <LaserDivider />

        {/* 3. RECENT RECAPS (Now both with Video-on-Hover) */}
        <section className="py-40 bg-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={16} className="text-brandRed fill-brandRed" />
                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-brandRed">Live Energy</h2>
              </div>
              <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">High <span className="text-zinc-800 italic">Frequency</span></h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* CARD 1: AGAM RECAP */}
              <div className="group relative p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-brandRed/40 transition-all duration-700 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-60 transition-opacity duration-1000">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale group-hover:grayscale-0">
                    <source src="/videos/agam-recap.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="relative z-10">
                  <span className="text-zinc-600 font-mono text-xs tracking-widest uppercase">Jan 2026</span>
                  <h4 className="text-4xl font-black uppercase mt-6 mb-4 tracking-tight group-hover:text-brandRed transition-colors">Agam Live Recap</h4>
                  <p className="text-zinc-500 text-lg font-medium leading-relaxed italic group-hover:text-zinc-300">Experience the night Carnatic Progressive Rock met the heart of Pune.</p>
                </div>
              </div>

              {/* CARD 2: JAMMING SESSION (Now with Video!) */}
              <div className="group relative p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-brandRed/40 transition-all duration-700 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-60 transition-opacity duration-1000">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale group-hover:grayscale-0">
                    <source src="/videos/jam.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="relative z-10">
                  <span className="text-zinc-600 font-mono text-xs tracking-widest uppercase">Feb 2026</span>
                  <h4 className="text-4xl font-black uppercase mt-6 mb-4 tracking-tight group-hover:text-brandRed transition-colors">Jamming Session</h4>
                  <p className="text-zinc-500 text-lg font-medium leading-relaxed italic group-hover:text-zinc-300">Our unplugged community jams bringing the raw soul of Kerala to the city streets.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <LaserDivider />

        {/* 4. FOUNDERS SECTION (Clean Static Portraits) */}
        <section className="py-40 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-24">Meet The <span className="text-brandRed">Founders</span></h2>
            <div className="flex flex-wrap justify-center gap-16 lg:gap-32">
              <div className="group w-full max-w-[340px]">
                <div className="aspect-[3/4] bg-zinc-950 rounded-[50px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 shadow-2xl relative">
                  <Image src="/founders/suchi.jpg" alt="Suchi" fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter">Sucheendran K.C</h4>
                <p className="text-brandRed font-black uppercase text-[10px] tracking-[0.5em] mt-3">Founder</p>
              </div>
              <div className="group w-full max-w-[340px]">
                <div className="aspect-[3/4] bg-zinc-950 rounded-[50px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 shadow-2xl relative">
                  <Image src="/founders/shehanas.jpg" alt="Shena" fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter">Shena</h4>
                <p className="text-brandRed font-black uppercase text-[10px] tracking-[0.5em] mt-3">Co-Founder</p>
              </div>
            </div>
            <div className="mt-28">
              <Link href="/about" className="group/btn relative inline-flex items-center gap-6 px-14 py-6 rounded-full border border-white/10 overflow-hidden hover:border-brandRed transition-all duration-500">
                <div className="absolute inset-0 bg-brandRed translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.4em] group-hover/btn:text-white">Know More About Our Journey</span>
                <ArrowUpRight className="relative z-10 group-hover/btn:rotate-45 transition-transform" size={18} />
              </Link>
            </div>
          </div>
        </section>

        <LaserDivider />

        {/* 5. FOOTER */}
        <footer className="py-32 bg-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between gap-24 mb-24">
              <div className="space-y-12 max-w-lg">
                {/* LOGO - Increased scale and added glow */}
                <div className="relative inline-block group">
  <Link href="/">
    <Image 
      src="/logo.png" 
      alt="Puneri Mallus" 
      width={500} 
      height={180} 
      className="h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_50px_rgba(255,0,0,0.6)] group-hover:scale-105" 
    />
  </Link>
</div>

                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">
                  Kerala's <span className="text-brandRed">Heart</span>, <br /> 
                  Pune's Soul.
                </h2>

                <div className="flex gap-4">
                  {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                    <Link 
                      key={i} 
                      href="#" 
                      className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-brandRed hover:border-brandRed transition-all duration-500 hover:-translate-y-2"
                    >
                      <Icon size={24} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 lg:gap-24">
                <div className="space-y-8">
                  <h4 className="text-brandRed font-black uppercase text-[10px] tracking-[0.5em]">Navigation</h4>
                  <ul className="space-y-5">
                    {['Home', 'About Us', 'Events', 'Community'].map((item) => (
                      <li key={item}>
                        <Link href={item === 'About Us' ? '/about' : '#'} className="text-lg font-bold text-zinc-500 hover:text-white transition-colors flex items-center group">
                          {item}
                          <ArrowUpRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all text-brandRed" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-8">
                  <h4 className="text-brandRed font-black uppercase text-[10px] tracking-[0.5em]">Connect</h4>
                  <ul className="space-y-5">
                    {['Mallu Dial', 'Contact', 'Join Tribe'].map((item) => (
                      <li key={item}>
                        <Link href="#" className="text-lg font-bold text-zinc-500 hover:text-white transition-colors flex items-center group">
                          {item}
                          <ArrowUpRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all text-brandRed" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              <p>© 2026 Puneri Mallus Community Hub</p>
              <div className="flex gap-4 items-center">
                <MapPin size={14} className="text-brandRed" />
                <span>Pune, India</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}