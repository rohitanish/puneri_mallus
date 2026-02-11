"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

export default function EventCard({ title, date, image, category, isUpcoming, description, time, location, mapUrl }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  // 1. PATH SANITIZER: Prevents Next/Image crashes from bad DB data (backslashes/missing slashes)
  const sanitizeSrc = (src: string) => {
    if (!src || src.trim() === "") return "/events/placeholder.jpg";
    if (src.startsWith("http")) return src;
    
    // Replace Windows backslashes and ensure leading slash
    let clean = src.replace(/\\/g, "/");
    return clean.startsWith("/") ? clean : `/${clean}`;
  };

  const safeSrc = sanitizeSrc(image);

  useEffect(() => {
    // Note: Use the current year for the countdown logic if applicable
    if (isUpcoming && title?.toUpperCase().includes("VALENTINE")) {
      const target = new Date("2026-02-14T19:00:00");
      const timer = setInterval(() => {
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            mins: Math.floor((diff / 1000 / 60) % 60),
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [title, isUpcoming]);

  const dateParts = date?.split(/[\s,]+/); 
  const month = dateParts?.[0] || "";
  const day = dateParts?.[1] || "";
  const year = dateParts?.[2] || "";

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      <div className={`relative overflow-hidden rounded-[32px] bg-zinc-900/30 border border-white/5 transition-all duration-500 ${isUpcoming ? 'bg-zinc-900/80 border-white/10 hover:border-brandRed/40' : 'hover:bg-zinc-900/60 opacity-80 hover:opacity-100'}`}>
        
        {/* IMAGE SECTION */}
        <div className={`relative w-full overflow-hidden ${isUpcoming ? 'aspect-[16/10]' : 'aspect-square'}`}>
          <Image 
            src={safeSrc} 
            alt={title} 
            fill 
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${isUpcoming ? 'opacity-90 group-hover:opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80'}`} 
            sizes="(max-w-7xl) 33vw, 100vw"
          />
          
          {/* Overlay for Valentine/Featured Countdown */}
          {isUpcoming && title?.toUpperCase().includes("VALENTINE") && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
              <div className="text-center font-black italic text-2xl text-white">
                <p className="text-[10px] tracking-[.3em] text-brandRed mb-2 uppercase font-black">Pulse Countdown</p>
                {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M
              </div>
            </div>
          )}
          
          <span className="absolute top-5 left-5 bg-brandRed text-white font-black text-[9px] px-4 py-1.5 rounded-lg tracking-widest uppercase z-20 shadow-xl border border-white/10">
            {category}
          </span>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8">
          
          {/* CALENDAR PAGE & TIME ROW */}
          <div className="flex items-center gap-5 mb-8">
            <div className="flex flex-col items-center justify-center w-16 h-20 bg-white rounded-2xl overflow-hidden shadow-[0_10px_20px_rgba(255,0,0,0.15)] group-hover:-rotate-2 transition-transform duration-500 flex-shrink-0">
              <div className="w-full bg-brandRed h-5 flex items-center justify-center gap-1">
                 <div className="w-1 h-1 bg-black/20 rounded-full" />
                 <div className="w-1 h-1 bg-black/20 rounded-full" />
              </div>
              <div className="flex flex-col items-center justify-center flex-1 leading-none py-2">
                <span className="text-black font-black text-[10px] uppercase tracking-tighter">{month}</span>
                <span className="text-black font-black text-2xl tracking-tighter">{day}</span>
                <span className="text-zinc-400 font-bold text-[8px] mt-1 border-t border-zinc-100 pt-1 w-full text-center">{year}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-brandRed font-black uppercase text-lg tracking-tighter leading-none">{date}</p>
              {time && (
                <div className="flex items-center gap-2 text-zinc-400">
                   <Clock size={12} className="text-brandRed/60" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{time}</span>
                </div>
              )}
            </div>
          </div>
          
          <h3 className={`font-black uppercase italic leading-tight mb-5 tracking-tighter transition-colors ${isUpcoming ? 'text-3xl text-white group-hover:text-brandRed' : 'text-2xl text-zinc-400'}`}>
            {title}
          </h3>

          {description && (
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3 group-hover:text-zinc-300 transition-colors">
              {description}
            </p>
          )}

          {/* DYNAMIC LOCATION BADGE WITH MAP LINK */}
          {location && (
            <div className="mb-10">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-brandRed/20 transition-all group/loc">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center group-hover/loc:bg-brandRed transition-colors flex-shrink-0 border border-white/5">
                    <MapPin size={16} className="text-brandRed group-hover/loc:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Venue</span>
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover/loc:text-white transition-colors leading-tight">
                      {location}
                    </p>
                  </div>
                </div>

                {mapUrl && (
                  <a 
                    href={mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-white hover:text-black rounded-xl text-[8px] font-black tracking-widest uppercase transition-all border border-white/5 shadow-lg"
                  >
                    Map <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}

          {isUpcoming && (
            <Link href="/events">
              <button className="w-full py-5 bg-brandRed text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all rounded-2xl shadow-[0_10px_30px_rgba(255,0,0,0.2)] active:scale-95">
                Book Tickets
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}