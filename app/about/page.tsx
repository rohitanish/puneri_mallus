"use client";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto space-y-20 pb-20">
        <header className="space-y-6">
          <h1 className="text-7xl font-black uppercase tracking-tighter italic">
            Our <span className="text-brandRed">Story</span>
          </h1>
          <div className="h-1 w-24 bg-brandRed shadow-[0_0_15px_#FF0000]" />
        </header>

        <section className="text-2xl md:text-3xl font-bold leading-tight text-zinc-400">
          Founded by a handful of Malayalis in <span className="text-white">Pune</span>, we grew from a small WhatsApp group into the city's most energetic diaspora hub. 
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[40px]">
            <h3 className="text-brandRed font-black uppercase tracking-widest text-sm mb-4">The Mission</h3>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium">To preserve the soul of Kerala while embracing the pace of Pune. We bridge the gap between tradition and modern urban life.</p>
          </div>
          <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[40px]">
            <h3 className="text-brandRed font-black uppercase tracking-widest text-sm mb-4">The Vision</h3>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium">To be the primary platform for every Pune-based Malayali to network, celebrate, and support one another.</p>
          </div>
        </div>
      </div>
    </main>
  );
}