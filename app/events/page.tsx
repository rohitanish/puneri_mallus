"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Search, 
  Calendar, 
  History, 
  Zap, 
  ArrowUpRight 
} from 'lucide-react';
import EventCard from '@/components/EventCard';

export default function EventsPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        // The API now returns 'isUpcoming' automatically
        setEvents(data);
      } catch (error) {
        console.error("Pulse Sync Failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- DYNAMIC FILTERING LOGIC ---
  const { upcoming, past } = useMemo(() => {
    const filtered = events.filter(e => 
      (filter === 'ALL' || e.category?.toUpperCase() === filter) && 
      e.title.toLowerCase().includes(search.toLowerCase())
    );

    return {
      upcoming: filtered.filter(e => e.isUpcoming),
      past: filtered.filter(e => !e.isUpcoming)
    };
  }, [events, filter, search]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="text-brandRed animate-spin mb-6" size={50} strokeWidth={1} />
        <div className="absolute inset-0 bg-brandRed/20 blur-[40px] rounded-full animate-pulse" />
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Retrieving Tribe Lineup...</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen relative overflow-hidden selection:bg-brandRed/30">
      
      {/* 1. ATMOSPHERIC BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-brandRed/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-brandRed/5 blur-[100px] rounded-full opacity-50" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 pt-48 pb-32 px-6 lg:px-20">
        
        {/* 2. HEADER & CONTROL CENTER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brandRed/10 border border-brandRed/20 rounded-full">
              <Zap size={12} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brandRed">Live Database Sync</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none text-white">
              The <br /> <span className="text-brandRed">Lineup.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4 w-full xl:w-auto"
          >
            {/* SEARCH BOX */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={16} />
              <input 
                placeholder="SEARCH EXPERIENCES..." 
                className="bg-zinc-950 border border-white/5 p-5 pl-12 rounded-2xl text-[10px] font-black tracking-widest outline-none focus:border-brandRed/50 transition-all text-white w-full md:w-80 shadow-2xl" 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>

            {/* FILTER TOGGLE */}
            <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
              {['ALL', 'CULTURAL', 'JAMMING', 'WORKSHOP'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)} 
                  className={`px-8 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${filter === c ? 'bg-brandRed text-white shadow-lg shadow-brandRed/20' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 3. UPCOMING SECTION (AUTOMATICALLY POPULATED) */}
        <EventSection 
          title="Upcoming Experiences" 
          subtitle="Join the next gathering of the tribe"
          icon={<Calendar className="text-brandRed" size={20} />}
          items={upcoming} 
          isUpcoming={true} 
          cols="lg:grid-cols-3" 
        />

        {/* 4. ARCHIVE SECTION (AUTOMATICALLY ARCHIVED) */}
        <div className="mt-40">
          <EventSection 
            title="The Archive" 
            subtitle="Memories forged in the heart of Pune"
            icon={<History className="text-zinc-700" size={20} />}
            items={past} 
            isUpcoming={false} 
            cols="lg:grid-cols-4" 
          />
        </div>

        {/* 5. EMPTY STATE */}
        {upcoming.length === 0 && past.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-zinc-800 font-black italic text-4xl uppercase tracking-widest">No Matches Found in Tribe Database</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventSection({ title, subtitle, icon, items, isUpcoming, cols }: any) {
  if (items.length === 0) return null;
  
  return (
    <div className="mb-24">
      <div className="flex flex-col gap-2 mb-12 border-l-2 border-brandRed/20 pl-6 text-white">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${isUpcoming ? 'text-white' : 'text-zinc-800'}`}>
            {title}
          </h2>
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] ml-8">{subtitle}</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-10`}>
        <AnimatePresence mode='popLayout'>
          {items.map((item: any, index: number) => (
            <motion.div
              key={item._id || item.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <EventCard {...item} isUpcoming={isUpcoming} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}