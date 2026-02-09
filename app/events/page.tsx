"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// PRE-LOADED LEGACY DATA
const INITIAL_DATA = [
  { id: 101, title: "AGAM: THE DREAM TOUR", date: "NOV 2025", category: "CULTURAL", type: "past", image: "/events/agam.jpg" },
  { id: 102, title: "Jamming Session 1", date: "SEP 2025", category: "JAMMING", type: "past", image: "/events/image_3.jpeg" },
  { id: 103, title: "Jamming Session 2", date: "JULY 2025", category: "JAMMING", type: "past", image: "/events/image_2.jpeg" },
  { id: 1, title: "Valentine's Special", date: "FEB 14,2026", category: "Jamming", type: "upcoming", image: "/events/valentines.jpg" },
];

export default function EventsPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState(INITIAL_DATA);

  useEffect(() => {
    const adminEvents = JSON.parse(localStorage.getItem('pm_events') || '[]');
    setEvents([...adminEvents, ...INITIAL_DATA]);
  }, []);

  const filtered = events.filter(e => 
    (filter === 'ALL' || e.category === filter) && 
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen pt-48 pb-20 px-6 lg:px-16">
      {/* HEADER SECTION */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
              The <span className="text-brandRed">Lineup.</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px]">
              Visualizing the Pulse of Pune Mallus
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group">
              <input 
                placeholder="SEARCH EVENTS..." 
                className="w-full md:w-64 bg-zinc-900/50 border border-white/5 py-4 px-6 rounded-2xl text-[10px] font-black tracking-widest focus:border-brandRed/50 outline-none transition-all" 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
              {['ALL', 'CULTURAL', 'JAMMING'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)} 
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                    filter === c ? 'bg-brandRed text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 1: LIVE & UPCOMING (3-COL) */}
        <EventSection 
          title="Upcoming" 
          items={filtered.filter(e => e.type === 'upcoming')} 
          isUpcoming 
          gridCols="lg:grid-cols-3" 
        />

        {/* SECTION 2: THE LEGACY ARCHIVE (5-COL) */}
        <div className="mt-32">
          <EventSection 
            title="The Archive" 
            items={filtered.filter(e => e.type === 'past')} 
            gridCols="lg:grid-cols-5" 
          />
        </div>
      </div>
    </div>
  );
}

const EventSection = ({ title, items, isUpcoming, gridCols }: any) => (
  items.length > 0 && (
    <div className="space-y-10">
      <div className="flex items-center gap-6">
        <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${isUpcoming ? 'text-white' : 'text-zinc-700'}`}>
          {title}
        </h2>
        <div className={`h-px flex-1 ${isUpcoming ? 'bg-brandRed/30' : 'bg-zinc-900'}`} />
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
        <AnimatePresence mode='popLayout'>
          {items.map((item: any) => (
            <EventCard key={item.id} {...item} isUpcoming={isUpcoming} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
);

function EventCard({ title, date, image, category, isUpcoming }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    if (title.includes("VALENTINE")) {
      const target = new Date("2026-02-14T19:00:00"); // 7:00 PM on V-Day
      const timer = setInterval(() => {
        const now = new Date();
        const difference = target.getTime() - now.getTime();
        
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            mins: Math.floor((difference / 1000 / 60) % 60),
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [title]);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group">
      <div className={`relative overflow-hidden rounded-[24px] bg-zinc-900/30 border border-white/5 transition-all duration-500 ${isUpcoming ? 'bg-zinc-900/80 border-white/10' : 'hover:bg-zinc-900/60'}`}>
        
        <div className={`relative w-full overflow-hidden ${isUpcoming ? 'aspect-[16/10]' : 'aspect-square'}`}>
          <Image 
            src={image} 
            alt={title} 
            fill 
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${isUpcoming ? 'opacity-90' : 'opacity-40 grayscale group-hover:grayscale-0'}`} 
          />
          
          {/* THE COUNTDOWN OVERLAY - Only for Valentine's */}
          {isUpcoming && title.includes("VALENTINE") && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-center">
                <p className="text-[10px] font-black tracking-[0.3em] mb-2 text-brandRed">COUNTDOWN</p>
                <div className="flex gap-4 text-white font-black italic text-2xl">
                  <div>{timeLeft.days}<span className="text-[10px] block not-italic font-bold text-zinc-400">DAYS</span></div>
                  <div>{timeLeft.hours}<span className="text-[10px] block not-italic font-bold text-zinc-400">HRS</span></div>
                  <div>{timeLeft.mins}<span className="text-[10px] block not-italic font-bold text-zinc-400">MINS</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span className="bg-brandRed text-white font-black text-[8px] px-3 py-1 rounded-lg tracking-[0.2em] uppercase">{category}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-1">
             <p className="text-brandRed font-mono text-[10px] tracking-widest uppercase font-bold">{date}</p>
             {isUpcoming && title.includes("VALENTINE") && (
               <span className="animate-pulse text-[9px] font-black text-brandRed bg-brandRed/10 px-2 py-0.5 rounded">LIVE TRACKING</span>
             )}
          </div>
          <h3 className={`font-black uppercase italic leading-[1.1] tracking-tight mb-4 ${isUpcoming ? 'text-xl' : 'text-sm text-zinc-400'}`}>
            {title}
          </h3>
          {isUpcoming && (
            <Link href="/tickets">
              <button className="w-full py-3 bg-brandRed text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-500 rounded-xl shadow-[0_10px_20px_rgba(255,0,0,0.2)]">
                Book Tickets
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}