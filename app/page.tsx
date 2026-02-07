"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';
import EventGlimpse from '@/components/EventGlimpse';

// Cinematic Laser Beam Divider
const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
    <div className="absolute w-full h-[80px] bg-brandRed/10 blur-[50px] opacity-70 pointer-events-none" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-brandRed/30">
      
      {/* 1. HERO SECTION WITH BLENDED BACKGROUND */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black">
        
        {/* --- THE BACKGROUND ENGINE --- */}
        <div className="absolute inset-0 -z-10">
          <img
    src="/hero-bg.jpeg" 
    alt="Background"
    className="w-full h-full object-cover opacity-50"
  />
          
          {/* Layer 1: Top & Bottom Fade (Ensures Navbar and Divider blend) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          
          {/* Layer 2: Deep Side Vignette (Focuses eye on the center) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_20%,_black_100%)]" />
          
          {/* Layer 3: Dark Tint (Keeps text readable) */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* HERO CONTENT */}
        <div className="text-center z-10 space-y-12 -mt-24">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Puneri Mallus" 
              width={600} 
              height={250} 
              className="h-[180px] w-auto object-contain drop-shadow-[0_0_35px_rgba(255,0,0,0.5)]"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
              Kerala's Heart, <br />
              <span className="text-brandRed drop-shadow-[0_0_40px_rgba(255,0,0,0.8)]">Pune's Soul.</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-400 font-bold max-w-2xl mx-auto uppercase tracking-[0.6em]">
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

      {/* 2. EVENT GLIMPSE */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">
              Event <span className="text-brandRed">Glimpse</span>
            </h2>
            <Link href="/events" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-brandRed transition">View Full Gallery</Link>
          </div>
          <EventGlimpse />
        </div>
      </section>

      <LaserDivider />

      {/* 3. RECENT WORKS / RECAPS */}
      <section className="py-40 bg-black relative overflow-hidden">
        {/* Subtle background glow to keep things cinematic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandRed/5 blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-brandRed mb-4">Past Vibes</h2>
            <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Recent <span className="text-zinc-800 tracking-normal italic">Recaps</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Recap Card 1 */}
            <div className="group p-12 rounded-[40px] bg-zinc-900/10 border border-white/5 hover:border-brandRed/30 transition-all duration-700">
              <span className="text-zinc-600 font-mono text-sm tracking-tighter">JAN 2026</span>
              <h4 className="text-4xl font-black uppercase mt-6 mb-4 group-hover:text-brandRed transition-colors tracking-tight">Agam Live In Pune</h4>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">A sold-out night of Carnatic Progressive Rock that brought our diaspora together under one roof.</p>
            </div>
            {/* Recap Card 2 */}
            <div className="group p-12 rounded-[40px] bg-zinc-900/10 border border-white/5 hover:border-brandRed/30 transition-all duration-700">
              <span className="text-zinc-600 font-mono text-sm tracking-tighter">FEB 2026</span>
              <h4 className="text-4xl font-black uppercase mt-6 mb-4 group-hover:text-brandRed transition-colors tracking-tight">The Digital Hub</h4>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">Launching our official community portal to streamline networking, ticketing, and support for all.</p>
            </div>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 4. FOUNDERS SECTION */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-24 text-white">
            Meet The <span className="text-brandRed">Founders</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-20">
            {/* Founder Card 1 */}
            <div className="group w-full max-w-[320px]">
              <div className="aspect-[3/4] bg-zinc-950 rounded-[45px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 grayscale group-hover:grayscale-0 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-zinc-900 text-8xl font-black italic uppercase">RA</div>
              </div>
              <h4 className="text-3xl font-black uppercase tracking-tight">Rohit Anish</h4>
              <p className="text-brandRed font-bold uppercase text-xs tracking-[0.4em] mt-3">Visionary & Strategy</p>
            </div>

            {/* Founder Card 2 */}
            <div className="group w-full max-w-[320px]">
              <div className="aspect-[3/4] bg-zinc-950 rounded-[45px] mb-8 overflow-hidden border border-white/10 group-hover:border-brandRed transition-all duration-700 grayscale group-hover:grayscale-0 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-zinc-900 text-8xl font-black italic uppercase">PM</div>
              </div>
              <h4 className="text-3xl font-black uppercase tracking-tight">Co-Founder</h4>
              <p className="text-brandRed font-bold uppercase text-xs tracking-[0.4em] mt-3">Operations</p>
            </div>
          </div>
        </div>
      </section>

     {/* GLOWING BEAM BEFORE FOOTER */}
      <LaserDivider />

      {/* 5. FOOTER */}
     
      <LaserDivider />

      <footer className="py-24 bg-black relative overflow-hidden">
        {/* Ambient background glow to anchor the footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brandRed/5 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
            
            {/* LEFT SIDE: BIG BRANDING */}
            <div className="space-y-8 max-w-lg">
              <Image 
                src="/logo.png" 
                alt="Puneri Mallus" 
                width={350} 
                height={120} 
                className="h-[110px] w-auto object-contain" 
              />
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight">
                Building the <span className="text-brandRed">Ultimate Hub</span> <br /> 
                for Pune Malayalis.
              </h2>
              
              {/* SOCIAL LOGOS */}
              <div className="flex gap-4 pt-4">
                {[
                  { icon: <Instagram size={24} />, href: "#" },
                  { icon: <Facebook size={24} />, href: "#" },
                  { icon: <MessageCircle size={24} />, href: "#" },
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-brandRed hover:border-brandRed transition-all duration-500 hover:-translate-y-1"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: MODERN LINKS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
              <div className="space-y-6">
                <h4 className="text-brandRed font-black uppercase text-xs tracking-[0.3em]">Explore</h4>
                <ul className="space-y-4">
                  {['Home', 'About Us', 'Events', 'Community'].map((item) => (
                    <li key={item}>
                      <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-lg font-bold text-zinc-400 hover:text-white transition-colors flex items-center group">
                        {item}
                        <ArrowUpRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-brandRed font-black uppercase text-xs tracking-[0.3em]">Services</h4>
                <ul className="space-y-4">
                  {['Mallu Dial', 'Support', 'Contact', 'Privacy'].map((item) => (
                    <li key={item}>
                      <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-lg font-bold text-zinc-400 hover:text-white transition-colors flex items-center group">
                        {item}
                        <ArrowUpRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FINAL COPYRIGHT STRIP */}
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brandRed rounded-full animate-pulse" />
              <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500">
                © 2026 Puneri Mallus Community
              </p>
            </div>
            
            <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-zinc-700">
              <span className="hover:text-zinc-400 cursor-default transition">Pune, India</span>
              <span className="hover:text-zinc-400 cursor-default transition">Malayali Diaspora Hub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}