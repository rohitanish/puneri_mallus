"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Handshake, 
  Globe, 
  Zap, 
  ArrowRight, 
  Music,
  Heart
} from 'lucide-react';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-24">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
  </div>
);

export default function AboutPage() {
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideos(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      
      {/* 1. ABOUT PUNERI MALLUS HEADER */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group shadow-2xl">
          <Image src="/about/community.jpeg" alt="Puneri Mallus Community" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            About <br /><span className="text-brandRed">Puneri Mallus.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed italic">
            What started as a digital handshake is now the heartbeat of the Kerala diaspora in Pune. We are a cultural bridge, a support system, and a family away from home.
          </p>
        </div>
      </section>

      <LaserDivider />

      {/* 2. AGAM: THE PIONEER PROGRAM */}
      <section className="max-w-7xl mx-auto mb-32">
        <div className="relative p-8 md:p-16 lg:p-20 rounded-[60px] bg-zinc-950 border border-brandRed/30 overflow-hidden group">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-2/5 space-y-8 order-2 lg:order-1">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                Agam: The <br /><span className="text-white">Pioneer Program</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed italic">Bringing the best of Kerala's art and intellectual property to the heart of Pune.</p>
            </div>
            <div className="w-full lg:w-3/5 order-1 lg:order-2">
              <div className="relative h-[400px] md:h-[550px] lg:h-[650px] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                <Image src="/about/agams.jpg" alt="Agam Program" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 3. JAMMING SESSIONS (Hybrid Animation) */}
      <section className="max-w-7xl mx-auto mb-32 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] md:h-[600px] rounded-[50px] overflow-hidden border border-white/10 group order-2 lg:order-1">
            <Image 
              src="/about/image_1.jpeg" 
              alt="Jamming" 
              fill 
              className={`object-cover transition-opacity duration-1000 ${showVideos ? 'opacity-0' : 'opacity-70'}`} 
            />
            {showVideos && (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 animate-in fade-in duration-1000">
                <source src="/videos/jam.mp4" type="video/mp4" />
              </video>
            )}
            <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
              <Music className="text-brandRed" size={18} />
              <p className="text-white font-black uppercase text-[10px] tracking-widest">Unplugged Live</p>
            </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              The <span className="text-brandRed">Jamming</span> <br />Sessions.
            </h2>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed italic">Musical bonds that recreate the magic of Kerala unplugged.</p>
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 4. BEAUTY PAGEANT (Hybrid Animation) */}
      <section className="max-w-7xl mx-auto mb-32 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              The <span className="text-brandRed">Beauty</span> <br />Pageant Pune.
            </h2>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed italic">A platform for confidence, glamour, and cultural identity.</p>
          </div>
          <div className="relative h-[500px] md:h-[600px] w-full rounded-[60px] overflow-hidden border border-white/10 group">
            <Image 
              src="/about/beauty.jpeg" 
              alt="Pageant" 
              fill 
              className={`object-cover transition-opacity duration-1000 ${showVideos ? 'opacity-0' : 'opacity-70'}`} 
            />
            {showVideos && (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 animate-in fade-in duration-1000">
                <source src="/videos/beauty.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </section>

      <LaserDivider />

      {/* 5. THE FOUNDERS (Architects) */}
      <section className="max-w-7xl mx-auto text-center mb-32">
        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-20">The <span className="text-brandRed">Architects</span></h2>
        <div className="flex flex-wrap justify-center gap-16">
          <div className="group w-full max-w-[280px]">
            <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 mb-6 bg-zinc-950 shadow-2xl">
              <Image src="/founders/suchi.jpg" alt="Sucheendran KC" width={300} height={400} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <h4 className="text-2xl font-black uppercase italic">Sucheendran K.C</h4>
            <p className="text-brandRed font-bold text-xs uppercase tracking-[0.3em] mt-2">Founder</p>
          </div>
          <div className="group w-full max-w-[280px]">
            <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 mb-6 bg-zinc-950 shadow-2xl">
              <Image src="/founders/shehanas.jpg" alt="Shena" width={300} height={400} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <h4 className="text-2xl font-black uppercase italic">Shena</h4>
            <p className="text-brandRed font-bold text-xs uppercase tracking-[0.3em] mt-2">Co-Founder</p>
          </div>
        </div>
      </section>

            <LaserDivider />
      {/* 6. COMMUNITIES & PARTNERS (NETWORK) */}
      <section className="max-w-7xl mx-auto text-center mb-40">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Our <span className="text-brandRed">Network</span>
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs mt-4">Supporting Organizations & Partners</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Kerala Tourism", icon: <Globe size={32}/> },
            { name: "Pune Malayali Fed.", icon: <Handshake size={32}/> },
            { name: "Digital Partners", icon: <ShieldCheck size={32}/> },
            { name: "Community Support", icon: <Heart size={32}/> },
          ].map((partner, idx) => (
            <div key={idx} className="p-10 bg-zinc-900/10 border border-white/5 rounded-[30px] flex flex-col items-center justify-center text-center group hover:border-brandRed transition-all">
              <div className="text-zinc-600 group-hover:text-brandRed mb-4 transition-colors">{partner.icon}</div>
              <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{partner.name}</span>
            </div>
          ))}
        </div>
      </section>
          <LaserDivider />
      {/* 7. JOIN US CALL TO ACTION */}
      <section className="max-w-4xl mx-auto text-center pb-20">
        <div className="p-16 rounded-[50px] bg-gradient-to-br from-brandRed to-red-900 shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-tight">Become a part of the <br /> tribe today.</h2>
          <Link href="/auth/login">
            <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-110 transition flex items-center gap-3 mx-auto shadow-lg">
              Join Us Now <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}