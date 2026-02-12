"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Music, Sparkles, ArrowUpRight, Users, 
  Mic2, Camera, Flame, Zap, MapPin, 
  Instagram, Facebook, MessageCircle 
} from 'lucide-react';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-8">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[30%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
  </div>
);

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* 1. DYNAMIC GRADIENT BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[30%] w-[800px] h-[400px] bg-brandRed/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-32 pb-20 px-6">
        
        {/* HEADER */}
        <div className="text-center mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brandRed/10 border border-brandRed/20 rounded-full mb-4">
            <Zap size={14} className="text-brandRed" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brandRed">Select Your Tribe</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Our <span className="text-brandRed">Circles .</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-sm md:text-xl">
            Diverse Interests . One Soul
          </p>
        </div>

        {/* COMMUNITY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          
          {/* 1. MALLU BEATS CARD */}
          <div className="group relative bg-zinc-950/50 border border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-brandRed/30 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-brandRed/0 group-hover:bg-brandRed/[0.03] transition-colors duration-700" />
            
            <div className="relative w-full h-64 overflow-hidden">
              <Image 
                src="/about/image_1.jpeg" 
                alt="Mallu Beats"
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute top-6 left-6 bg-brandRed p-3 rounded-2xl shadow-xl z-20">
                <Music className="text-white" size={20} />
              </div>
            </div>

            <div className="p-10 space-y-6 relative z-10 text-left">
              <div className="space-y-2">
                <span className="text-brandRed font-black uppercase text-[9px] tracking-[0.4em]">Pulse // Audio Tribe</span>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                  Mallu <span className="text-brandRed">Beats .</span>
                </h2>
                <p className="text-zinc-500 text-sm font-medium italic leading-relaxed">
                  The raw rhythm of Kerala in Pune. For vocalists, percussionists, and soul-seekers.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/community/mallu-beats" className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center hover:bg-brandRed hover:text-white transition-all active:scale-95 shadow-lg">
                  Join Session
                </Link>
                <div className="px-5 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center group-hover:border-brandRed/20 transition-colors">
                   <Users className="text-zinc-600 group-hover:text-brandRed" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. BEAUTY PAGEANT CARD */}
          <div className="group relative bg-zinc-950/50 border border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-white/10 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-700" />

            <div className="relative w-full h-64 overflow-hidden">
              <Image 
                src="/about/beauty.jpeg" 
                alt="Mallu Fashion"
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute top-6 left-6 bg-white p-3 rounded-2xl shadow-xl z-20">
                <Sparkles className="text-black" size={20} />
              </div>
            </div>

            <div className="p-10 space-y-6 relative z-10 text-left">
              <div className="space-y-2">
                <span className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em]">Grace // Runway Tribe</span>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                  Beauty <span className="text-zinc-400">Pageant .</span>
                </h2>
                <p className="text-zinc-500 text-sm font-medium italic leading-relaxed">
                  A platform for Malayali girls in Pune to showcase grace, culture, and high fashion.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/community/mallu-queens" className="flex-1 bg-brandRed text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg">
                  Enter Runway
                </Link>
                <div className="px-5 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center group-hover:border-white/20 transition-colors">
                   <Camera className="text-zinc-600 group-hover:text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="text-center">
          <LaserDivider />
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-12 opacity-40">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">500+ Active Voices</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Weekly Tribe Jams</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FOOTER */}
      <footer className="py-20 bg-black relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brandRed/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            
            <div className="lg:col-span-5 space-y-8">
              <div className="relative inline-block group">
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

              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight max-w-xs text-white text-left">
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
                        href={item === 'Admin' ? '/admin' : '#'} 
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