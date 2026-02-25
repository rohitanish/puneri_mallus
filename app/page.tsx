"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Instagram, Facebook, MessageCircle, ArrowUpRight, 
  MapPin, Zap, Loader2 
} from 'lucide-react';
import EventCard from '@/components/EventCard';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-4">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[45%] h-[2px] bg-brandRed shadow-[0_0_25px_#FF0000] z-10" />
    <div className="absolute w-full h-[80px] bg-brandRed/5 blur-[60px] opacity-70 pointer-events-none" />
    <div className="absolute w-24 h-px bg-white blur-[1.5px] opacity-40 z-20" />
  </div>
);

export default function Home() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroVideo, setHeroVideo] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videoTimer = setTimeout(() => setHeroVideo(true), 2000);
    
    const fetchHomePulse = async () => {
  try {
    const [sliderRes, eventRes] = await Promise.all([
      fetch('/api/settings/slider'),
      fetch('/api/events')
    ]);
    
    const sliderData = await sliderRes.json();
    const allEvents = await eventRes.json();

    if (sliderData?.slides?.length > 0) {
      setSlides(sliderData.slides);
    }

    // --- ENHANCED FILTERING & PRIORITIZATION ---
    
    // 1. Identify all upcoming nodes and prioritize 'featured' ones for the spotlight
    const upcomingNodes = allEvents
      .filter((e: any) => e.isUpcoming === true)
      .sort((a: any, b: any) => (b.featured === a.featured) ? 0 : b.featured ? 1 : -1);

    // 2. Identify past events marked 'featured' for the Glimpse grid
    const pastFeatured = allEvents
      .filter((e: any) => e.isUpcoming === false && e.featured === true);

    // 3. Uniform ID Mapping for React Keys
    const format = (list: any[]) => list.map(e => ({ 
      ...e, 
      id: e._id || e.id // Defensive mapping
    }));

    // Update state with slices
    setUpcoming(format(upcomingNodes).slice(0, 1)); // Single spotlight
    setPast(format(pastFeatured).slice(0, 3));      // Grid items

  } catch (err) {
    console.error("Pulse Link Interrupted:", err);
  } finally {
    setLoading(false);
  }
};

    fetchHomePulse();
    return () => clearTimeout(videoTimer);
  }, []);

  // Slider Autoplay (Only if slides exist)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg|mov)/i) || url?.includes("video");

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="text-brandRed animate-spin mb-4" size={40} />
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Syncing Tribe Pulse...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-brandRed/30 relative">
      
     {/* 1. HERO SECTION (DYNAMIC SLIDER OR ORIGINAL DEFAULT) */}
<section className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
  
  {slides.length > 0 ? (
    // DYNAMIC SLIDER MODE
    slides.map((slide, index) => (
      <div 
        key={index} 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out 
          ${index === currentSlide 
            ? 'opacity-100 scale-100 z-20 pointer-events-auto' 
            : 'opacity-0 scale-110 z-0 pointer-events-none'
          }`}
      >
        <div className="absolute inset-0 z-0">
          {isVideo(slide.mediaUrl) ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
              <source src={slide.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <Image 
              src={slide.mediaUrl} 
              alt="Slide" 
              fill 
              className="object-cover opacity-60 grayscale-[10%]" 
              priority={index === 0} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="space-y-6 max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/90">{slide.title}</h1>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-brandRed drop-shadow-[0_0_25px_rgba(255,0,0,0.4)]">{slide.subtitle}</h2>
            <p className="text-lg md:text-2xl text-zinc-500 font-bold uppercase tracking-[0.5em] pt-4">{slide.description}</p>
            
            {slide.buttonText && (
              <div className="pt-12">
                <Link href={slide.buttonLink || "/about"} className="relative z-50 inline-block">
                  <button className="cursor-pointer group relative bg-brandRed text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm hover:scale-110 transition-all shadow-[0_0_60px_rgba(255,0,0,0.4)] active:scale-95">
                    <span className="relative z-10 flex items-center gap-3">
                      {slide.buttonText}
                      <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    {/* SWAPPING TRANSLATION FOR OPACITY TO REMOVE THE WHITE BOX GHOSTING */}
  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    ))
  ) : (
    // ORIGINAL DEFAULT HERO MODE (Visible if no slides added)
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpeg"
          alt="Puneri Mallus Background"
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

      <div className="relative z-20 text-center space-y-12 px-6">
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
        <div className="pt-8">
          <Link href="/about" className="relative z-50">
            <button className="cursor-pointer group relative bg-brandRed text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all hover:scale-110 shadow-[0_0_60px_rgba(255,0,0,0.4)]">
              <span className="relative z-10 flex items-center gap-3">
                Know More <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )}

  {/* Slider Controls */}
  {slides.length > 1 && (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-4 pointer-events-auto">
      {slides.map((_, i) => (
        <button 
          key={i} 
          onClick={() => setCurrentSlide(i)} 
          className={`cursor-pointer h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-brandRed' : 'w-4 bg-white/20'}`} 
        />
      ))}
    </div>
  )}
</section>

        <LaserDivider />

        {/* 2. UPCOMING EXPERIENCE SPOTLIGHT */}
<section className="relative py-32 bg-black overflow-hidden">

  {/* Background: huge ghosted index number */}
  <span
    aria-hidden
    className="pointer-events-none select-none absolute -top-8 right-0 text-[22vw] font-black leading-none text-white/[0.03] tracking-tighter"
  >
    01
  </span>

  {/* Horizontal rule + label */}
  <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
    <div className="flex items-center gap-6 mb-4">
      <span className="text-brandRed font-mono text-[10px] tracking-[0.5em] uppercase">
        §&nbsp;upcoming
      </span>
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/20 font-mono text-[10px] tracking-widest">
        2026 / SERIES
      </span>
    </div>

    {/* Main heading — bleeds left */}
    <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.82] tracking-tighter text-white mb-24 -ml-1">
      Next<br />
      <span className="text-brandRed [-webkit-text-stroke:0px]">Experience</span>
    </h2>

    {upcoming.length > 0 ? (
      upcoming.map(event => (
        <div
          key={event.id || event._id}
          className="group relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-start"
        >
          {/* ── LEFT: Card ── */}
          <div className="relative">
            {/* Diagonal clip overlay on hover */}
            <div className="relative overflow-hidden rounded-[4px]
                            before:content-[''] before:absolute before:inset-0 before:z-10
                            before:bg-gradient-to-br before:from-brandRed/20 before:to-transparent
                            before:opacity-0 before:transition-opacity before:duration-500
                            group-hover:before:opacity-100">
              <EventCard {...event} isUpcoming={true} />
            </div>

            {/* Floating capacity badge */}
            <div className="absolute -top-4 -right-4 z-20 bg-brandRed text-white
                            text-[9px] font-black tracking-[0.4em] uppercase
                            px-4 py-2 rounded-full shadow-lg shadow-brandRed/30
                            animate-pulse">
              Limited
            </div>
          </div>

          {/* ── MIDDLE: Vertical divider ── */}
          <div className="hidden lg:flex flex-col items-center mx-12 pt-6 gap-3 self-stretch">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <span className="text-white/20 font-mono text-[9px] tracking-widest rotate-0">×</span>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          {/* ── RIGHT: Copy ── */}
          <div className="flex flex-col justify-between gap-10 pt-6 lg:pt-0 min-h-[340px]">

            {/* Top meta row */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brandRed animate-ping" />
              <span className="text-white/40 font-mono text-[10px] tracking-[0.4em] uppercase">
                Live Event · Limited Capacity
              </span>
            </div>

            {/* Title */}
            <div className="space-y-6">
              <h3
                className="text-5xl xl:text-7xl font-black uppercase italic leading-[0.88]
                           tracking-tighter text-white group-hover:text-brandRed
                           transition-colors duration-500"
              >
                {event.title}
              </h3>

              {/* Description with left accent */}
              <p className="relative pl-5 text-zinc-400 text-lg leading-relaxed font-light max-w-sm
                            before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1
                            before:w-[2px] before:bg-brandRed/50">
                {event.description}
              </p>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-6">
              <Link href="/events">
                <button
                  className="relative px-10 py-4 bg-brandRed text-white font-black uppercase
                             text-[10px] tracking-[0.35em] rounded-full overflow-hidden
                             shadow-xl shadow-brandRed/20
                             transition-transform duration-200 active:scale-95
                             after:content-[''] after:absolute after:inset-0
                             after:bg-white/10 after:opacity-0 hover:after:opacity-100
                             after:transition-opacity after:duration-300"
                >
                  Secure Your Spot
                </button>
              </Link>

              <Link
                href="/events"
                className="text-white/30 hover:text-white font-mono text-[10px]
                           tracking-[0.3em] uppercase transition-colors duration-300
                           flex items-center gap-2"
              >
                View All
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

          </div>
        </div>
      ))
    ) : (
      /* Empty state */
      <div
        className="relative flex flex-col items-center justify-center py-40
                   border border-white/5 rounded-[2px] overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <span className="text-white/10 font-black italic text-[10vw] uppercase tracking-tighter leading-none">
          Soon
        </span>
        <p className="text-zinc-700 font-mono text-xs uppercase tracking-[0.5em] mt-4 animate-pulse">
          New Experiences Dropping
        </p>
      </div>
    )}
  </div>
</section>

        <LaserDivider />

        {/* 3. EVENT GLIMPSE SECTION */}
        <section className="py-40 bg-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                Event <span className="text-brandRed">Glimpse</span>
              </h2>
              <Link href="/events" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-brandRed transition-all">
                View All Events
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {past.map((event) => (
                <EventCard 
                  key={event.id}
                  {...event}
                  isUpcoming={false} 
                />
              ))}
            </div>
          </div>
        </section>

        <LaserDivider />

        {/* 4. RECENT RECAPS */}
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

        {/* 5. FOUNDERS SECTION */}
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


      </div>
    
  );
}