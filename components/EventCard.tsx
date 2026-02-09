"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

// Added mapUrl to the props
export default function EventCard({ title, date, image, category, isUpcoming, description, time, location, mapUrl }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    if (isUpcoming && title?.includes("VALENTINE")) {
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
      <div className={`relative overflow-hidden rounded-[32px] bg-zinc-900/30 border border-white/5 transition-all duration-500 ${isUpcoming ? 'bg-zinc-900/80 border-white/10' : 'hover:bg-zinc-900/60'}`}>
        
        {/* IMAGE SECTION */}
        <div className={`relative w-full overflow-hidden ${isUpcoming ? 'aspect-[16/10]' : 'aspect-square'}`}>
          <Image 
            src={image || '/events/placeholder.jpg'} 
            alt={title} 
            fill 
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${isUpcoming ? 'opacity-90' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`} 
          />
          
          {isUpcoming && title?.includes("VALENTINE") && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
              <div className="text-center font-black italic text-2xl text-white">
                <p className="text-[12px] tracking-[.3em] text-brandRed mb-2 uppercase">Starts In</p>
                {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M
              </div>
            </div>
          )}
          <span className="absolute top-5 left-5 bg-brandRed text-white font-black text-[10px] px-4 py-1.5 rounded-lg tracking-widest uppercase z-20 shadow-lg">
            {category}
          </span>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8">
          
          {/* CALENDAR PAGE & TIME ROW */}
          <div className="flex items-center gap-5 mb-8">
            <div className="flex flex-col items-center justify-center w-16 h-20 bg-white rounded-2xl overflow-hidden shadow-[0_10px_20px_rgba(255,0,0,0.3)] group-hover:-rotate-2 transition-transform duration-500 flex-shrink-0">
              <div className="w-full bg-brandRed h-5 flex items-center justify-center gap-1">
                 <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                 <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
              </div>
              <div className="flex flex-col items-center justify-center flex-1 leading-none py-2">
                <span className="text-black font-black text-[11px] uppercase">{month}</span>
                <span className="text-black font-black text-xl tracking-tighter">{day}</span>
                <span className="text-zinc-400 font-bold text-[10px] mt-1 border-t border-zinc-100 pt-1 w-full text-center">{year}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-brandRed font-black uppercase text-lg tracking-tighter leading-none">{date}</p>
              {time && (
                <div className="flex items-center gap-2 text-zinc-300">
                   <Clock size={14} className="text-brandRed" />
                   <span className="text-xs font-black uppercase tracking-[0.15em]">{time}</span>
                </div>
              )}
            </div>
          </div>
          
          <h3 className={`font-black uppercase italic leading-tight mb-5 tracking-tighter ${isUpcoming ? 'text-3xl' : 'text-2xl text-zinc-300'}`}>
            {title}
          </h3>

          {description && (
            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed mb-8 line-clamp-3 group-hover:text-zinc-200 transition-colors">
              {description}
            </p>
          )}

          {/* DYNAMIC LOCATION BADGE WITH MAP LINK */}
          {location && (
            <div className="mb-10">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-brandRed/30 transition-all group/loc">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center group-hover/loc:bg-brandRed transition-colors flex-shrink-0">
                    <MapPin size={18} className="text-brandRed group-hover/loc:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Venue</span>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-300 group-hover/loc:text-white transition-colors leading-tight">
                      {location}
                    </p>
                  </div>
                </div>

                {/* VIEW MAP BUTTON */}
                {mapUrl && (
                  <a 
                    href={mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black rounded-xl text-[8px] font-black tracking-widest uppercase transition-all"
                  >
                    Map <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}

          {isUpcoming && (
            <Link href="/events">
              <button className="w-full py-5 bg-brandRed text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all rounded-2xl shadow-[0_10px_30px_rgba(255,0,0,0.3)]">
                Book Tickets
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}