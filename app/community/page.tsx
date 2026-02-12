"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Music, Sparkles, ArrowUpRight, Users, 
  Mic2, Camera, Flame, Zap 
} from 'lucide-react';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-8">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[30%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
  </div>
);

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative selection:bg-brandRed/30 overflow-hidden">
      
      {/* 1. DYNAMIC GRADIENT BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Main Brand Red Glow */}
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/10 blur-[120px] rounded-full animate-pulse" />
        
        {/* Soft Zinc/White Glow for the Pageant Side */}
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
        
        {/* Deep Bottom Red Glow */}
        <div className="absolute bottom-[-10%] left-[30%] w-[800px] h-[400px] bg-brandRed/5 blur-[150px] rounded-full" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. MALLU BEATS CARD */}
          <div className="group relative bg-zinc-950/50 border border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-brandRed/30 shadow-2xl backdrop-blur-md">
            {/* Inner Glow Effect on Hover */}
            <div className="absolute inset-0 bg-brandRed/0 group-hover:bg-brandRed/[0.03] transition-colors duration-700" />
            
            <div className="relative w-full h-64 overflow-hidden">
              <Image 
                src="/about/image_1.jpeg" 
                alt="Mallu Beats"
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              {/* Image Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute top-6 left-6 bg-brandRed p-3 rounded-2xl shadow-xl z-20">
                <Music className="text-white" size={20} />
              </div>
            </div>

            <div className="p-10 space-y-6 relative z-10">
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

          {/* 2. MALLU QUEENS CARD */}
          <div className="group relative bg-zinc-950/50 border border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-white/10 shadow-2xl backdrop-blur-md">
            {/* Inner Glow Effect on Hover */}
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

            <div className="p-10 space-y-6 relative z-10">
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

        {/* BOTTOM STATS / FOOTER TEXT */}
        <div className="mt-32 text-center relative z-10">
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
    </div>
  );
}