"use client";
import { useState, useEffect } from 'react'; // Added hooks
import Image from 'next/image';
import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ArrowUpRight, 
  MapPin 
} from 'lucide-react';
import EventGlimpse from '@/components/EventGlimpse';

// 1. Cinematic Laser Beam Divider Component
const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
    <div className="absolute w-full h-[80px] bg-brandRed/10 blur-[50px] opacity-70 pointer-events-none" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // 2-second delay before switching to video
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-brandRed/30">
      
      {/* 1. HERO SECTION WITH HYBRID TRANSITION */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        
        {/* THE DYNAMIC BLEND ENGINE */}
        <div className="absolute inset-0 z-0">
          
          {/* STATIC IMAGE LAYER (Initially visible, fades out when video starts) */}
          <Image
            src="/hero-bg.jpeg"
            alt="Puneri Mallus Community"
            fill
            className={`object-cover grayscale-[20%] transition-opacity duration-1000 ${
              showVideo ? 'opacity-0' : 'opacity-60'
            }`}
            priority
            unoptimized 
          />

          {/* VIDEO LAYER (Fades in after 2 seconds) */}
          {showVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[10%] transition-opacity duration-1000"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
          )}
          
          {/* Layer 1: Top-Down Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          
          {/* Layer 2: Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_10%,_black_100%)] opacity-80 z-10" />
          
          {/* Layer 3: Dark Tint */}
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-20 text-center space-y-12 -mt-20 px-6">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Puneri Mallus" 
              width={600} 
              height={250} 
              className="h-[180px] w-auto object-contain drop-shadow-[0_0_45px_rgba(255,0,0,0.6)]"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
              Kerala's Heart, <br />
              <span className="text-brandRed drop-shadow-[0_0_40px_rgba(255,0,0,0.8)]">Pune's Soul.</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-400 font-bold max-w-2xl mx-auto uppercase tracking-[0.5em]">
              The Ultimate Hub for Pune Malayalis
            </p>
          </div>

          <div className="pt-8">
            <button className="bg-brandRed text-white px-16 py-6 rounded-full font-bold uppercase tracking-[0.2em] hover:scale-110 transition-all shadow-[0_0_60px_rgba(255,0,0,0.5)]">
              Explore Events
            </button>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 2. EVENT GLIMPSE SECTION */}
      <section className="py-40 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">
              Event <span className="text-brandRed">Glimpse</span>
            </h2>
            <Link href="/events" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-brandRed transition">View All Events</Link>
          </div>
          <EventGlimpse />
        </div>
      </section>

      <LaserDivider />

      {/* 3. RECENT RECAPS SECTION (Agam Video Recap) */}
      <section className="py-40 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-brandRed mb-4">Live Energy</h2>
            <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Recent <span className="text-zinc-800 tracking-normal italic">Recaps</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-brandRed/40 transition-all duration-700 overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-50 transition-opacity duration-700">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <source src="/videos/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              <div className="relative z-10">
                <span className="text-zinc-600 font-mono text-sm tracking-tighter group-hover:text-brandRed transition-colors">JAN 2026</span>
                <h4 className="text-4xl font-black uppercase mt-6 mb-4 tracking-tight">Agam Live In Pune</h4>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed italic group-hover:text-zinc-300 transition-colors">
                  A sold-out night of Carnatic Progressive Rock. Experience the energy that brought our diaspora together.
                </p>
                <div className="mt-8 flex items-center gap-3 text-brandRed font-black uppercase text-[10px] tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  <span className="w-8 h-px bg-brandRed" /> Watch Highlights
                </div>
              </div>
            </div>

            <div className="group p-12 rounded-[40px] bg-zinc-900/10 border border-white/5 hover:border-brandRed/40 transition-all duration-700">
              <span className="text-zinc-600 font-mono text-sm tracking-tighter">FEB 2026</span>
              <h4 className="text-4xl font-black uppercase mt-6 mb-4 group-hover:text-brandRed transition-colors tracking-tight">Jamming Session</h4>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed italic">Launching our official community portal to streamline networking for all.</p>
            </div>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 4. FOUNDERS SECTION */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-24">
            Meet The <span className="text-brandRed">Founders</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-20">
            <div className="group w-full max-w-[320px]">
              <div className="aspect-[3/4] bg-zinc-950 rounded-[45px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 shadow-2xl relative">
                <Image src="/founders/suchi.jpg" alt="Sucheendran KC" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <h4 className="text-3xl font-black uppercase tracking-tight">Sucheendran K.C</h4>
              <p className="text-brandRed font-bold uppercase text-xs tracking-[0.4em] mt-3">Founder</p>
            </div>
            <div className="group w-full max-w-[320px]">
              <div className="aspect-[3/4] bg-zinc-950 rounded-[45px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 shadow-2xl relative">
                <Image src="/founders/shehanas.jpg" alt="Shehanas" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <h4 className="text-3xl font-black uppercase tracking-tight">Shena</h4>
              <p className="text-brandRed font-bold uppercase text-xs tracking-[0.4em] mt-3">Co-Founder</p>
            </div>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 5. FOOTER */}
      <footer className="py-32 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brandRed/5 blur-[150px] -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
            <div className="space-y-8 max-w-lg">
              <Image src="/logo.png" alt="Puneri Mallus" width={350} height={120} className="h-[100px] w-auto object-contain" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
                Heart in <span className="text-brandRed">Kerala</span>, <br /> Home in Pune.
              </h2>
              <div className="flex gap-4 pt-4">
                {[{ icon: <Instagram size={24} />, href: "#" }, { icon: <Facebook size={24} />, href: "#" }, { icon: <MessageCircle size={24} />, href: "#" }].map((social, idx) => (
                  <a key={idx} href={social.href} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-brandRed hover:border-brandRed transition-all duration-500 hover:-translate-y-1 shadow-lg">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-24">
              <div className="space-y-8">
                <h4 className="text-brandRed font-black uppercase text-xs tracking-[0.3em]">Platform</h4>
                <ul className="space-y-5">
                  {['Home', 'About Us', 'Events', 'Community'].map((item) => (
                    <li key={item}>
                      <Link href="/" className="text-lg font-bold text-zinc-400 hover:text-white flex items-center group transition-all">
                        {item} <ArrowUpRight size={18} className="ml-2 opacity-0 group-hover:opacity-100 transition-all text-brandRed" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="text-brandRed font-black uppercase text-xs tracking-[0.3em]">Support</h4>
                <ul className="space-y-5">
                  {['Mallu Dial', 'Contact', 'Privacy Policy'].map((item) => (
                    <li key={item}>
                      <Link href="/" className="text-lg font-bold text-zinc-400 hover:text-white flex items-center group transition-all">
                        {item} <ArrowUpRight size={18} className="ml-2 opacity-0 group-hover:opacity-100 transition-all text-brandRed" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brandRed rounded-full animate-pulse" />
              <p>© 2026 Puneri Mallus Community Hub</p>
            </div>
            <div className="flex gap-4 items-center">
              <MapPin size={14} className="text-brandRed" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}