"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink, Zap } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  category: string;
  isUpcoming?: boolean;
  description?: string;
  time?: string;
  location?: string;
  mapUrl?: string;
  ticketUrl?: string;
}

export default function EventCard({ 
  title, 
  date, 
  image, 
  category, 
  isUpcoming = false, 
  description, 
  time, 
  location, 
  mapUrl,
  ticketUrl 
}: EventCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!date || !isUpcoming) return;

    const calculateTimeLeft = () => {
      try {
        const eventDateTimeStr = `${date} ${time || "12:00 AM"}`;
        const targetDate = new Date(eventDateTimeStr).getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            mins: Math.floor((difference / 1000 / 60) % 60),
            secs: Math.floor((difference / 1000) % 60),
          });
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (e) {
        console.error("Pulse calculation error:", e);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [date, time, isUpcoming]);

  const sanitizeSrc = (src: string) => {
    if (!src || src.trim() === "") return "/events/placeholder.jpg";
    if (src.startsWith("http")) return src;
    return src.replace(/\\/g, "/");
  };

  const safeSrc = sanitizeSrc(image);
  
  const dateParts = date?.split(/[\s,]+/) || []; 
  const month = dateParts[0] || "---";
  const day = dateParts[1] || "--";
  const year = dateParts[2] || "----";

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group h-full">
      <div className={`relative h-full flex flex-col overflow-hidden rounded-[40px] bg-zinc-950 border transition-all duration-700 ${
        isUpcoming 
        ? 'border-white/5 hover:border-brandRed/40 shadow-2xl' 
        : 'border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 shadow-none'
      }`}>
        
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image 
            src={safeSrc} 
            alt={title} 
            fill 
            className="object-cover transition-all duration-1000 group-hover:scale-110" 
            sizes="(max-w-7xl) 33vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
          
          <span className="absolute top-6 left-6 bg-brandRed text-white font-black text-[8px] px-4 py-2 rounded-xl tracking-[0.2em] uppercase z-20 shadow-2xl border border-white/10">
            {category || "Tribe Node"}
          </span>

          {isUpcoming && isLive && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 z-30">
              <div className="text-center p-6">
                <Zap size={24} className="text-brandRed mx-auto mb-4 animate-pulse" />
                <p className="text-[10px] tracking-[.4em] text-zinc-400 mb-6 uppercase font-black">Syncing Pulse In</p>
                
                <div className="flex gap-4 text-white font-black italic text-4xl tracking-tighter">
                   <div className="flex flex-col items-center">
                      <span className="leading-none">{timeLeft.days}</span>
                      <span className="text-[10px] not-italic text-white font-black uppercase tracking-[0.2em] mt-1">Days</span> 
                   </div>
                   <div className="text-brandRed animate-pulse leading-none">:</div>
                   <div className="flex flex-col items-center">
                      <span className="leading-none">{timeLeft.hours}</span>
                      <span className="text-[10px] not-italic text-white font-black uppercase tracking-[0.2em] mt-1">Hrs</span>
                   </div>
                   <div className="text-brandRed animate-pulse leading-none">:</div>
                   <div className="flex flex-col items-center">
                      <span className="leading-none">{timeLeft.mins}</span>
                      <span className="text-[10px] not-italic text-white font-black uppercase tracking-[0.2em] mt-1">Mins</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 flex-1 flex flex-col relative z-20">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex flex-col items-center justify-center w-16 h-20 bg-white rounded-2xl overflow-hidden shadow-2xl group-hover:-rotate-3 transition-transform duration-700 shrink-0">
              <div className="w-full bg-brandRed h-5 flex items-center justify-center gap-1">
                 <div className="w-1 h-1 bg-black/20 rounded-full" />
                 <div className="w-1 h-1 bg-black/20 rounded-full" />
              </div>
              <div className="flex flex-col items-center justify-center flex-1 text-black">
                <span className="font-black text-[9px] uppercase tracking-tighter">{month}</span>
                <span className="font-black text-2xl tracking-tighter">{day}</span>
                <span className="text-zinc-400 font-bold text-[7px] mt-1 uppercase">{year}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-white group-hover:text-brandRed transition-colors duration-500">
                {title}
              </h3>
              <div className="flex items-center gap-3 text-zinc-500">
                 <Clock size={14} className="text-brandRed" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{time}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC DESCRIPTION - Converts '-' into pointer list */}
          <div className="mb-10 relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-brandRed/30">
            <ul className="space-y-2">
              {description?.split('-').map((segment, idx) => {
                const trimmed = segment.trim();
                if (!trimmed) return null;
                return (
                  <li key={idx} className="text-zinc-500 text-[13px] font-medium leading-tight italic flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-brandRed shrink-0" />
                    <span>{trimmed}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-auto space-y-6">
            {location && (
              <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <MapPin size={18} className="text-brandRed" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Venue</span>
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-300 leading-tight">{location}</p>
                  </div>
                </div>
                {mapUrl && (
                  <a 
                    href={mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-zinc-950 hover:bg-white hover:text-black rounded-xl transition-all border border-white/10 group/map"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}

            {isUpcoming && (
              <a 
                href={ticketUrl || "/events"} 
                target={ticketUrl ? "_blank" : "_self"}
                rel={ticketUrl ? "noopener noreferrer" : ""}
                className="block"
              >
                <button className="w-full py-5 bg-brandRed text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all rounded-2xl shadow-xl active:scale-95">
                  Secure Your Spot Now
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}