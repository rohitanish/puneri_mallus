"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Calendar, History, Sparkles, ArrowRight } from 'lucide-react';
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
        setEvents(data);
      } catch (error) {
        console.error("Pulse Sync Failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(['ALL']);
    events.forEach(e => { if (e.category) cats.add(e.category.toUpperCase()); });
    return Array.from(cats);
  }, [events]);

  const { upcoming, past } = useMemo(() => {
    const filtered = events.filter(e => {
      const matchesFilter = filter === 'ALL' || e.category?.toUpperCase() === filter;
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    return {
      upcoming: filtered.filter(e => e.isUpcoming),
      past: filtered.filter(e => !e.isUpcoming)
    };
  }, [events, filter, search]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="text-brandRed animate-spin" size={30} strokeWidth={1} />
    </div>
  );

  return (
    <div className="bg-[#030303] min-h-screen relative selection:bg-brandRed/30">
      
      {/* 1. FIXED BRANDED BACKGROUND - VISIBILITY BOOSTED */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image 
          src="/events/eventsback.jpg" 
          alt="Event Background"
          fill
          className="object-cover object-center opacity-30 brightness-[0.6] saturate-[0.9]" // Increased Opacity/Brightness
          priority
        />
        {/* Subtle radial mask so it doesn't just cut off */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#030303]/40 to-[#030303]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303]" />
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      {/* Added z-10 and pb-40 to ensure Footer visibility */}
      <div className="max-w-[1400px] mx-auto relative z-10 pt-40 pb-48 px-6 lg:px-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
              The <br /> <span className="text-brandRed">Lineup.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row gap-3 w-full xl:w-auto"
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brandRed transition-colors" size={16} />
              <input 
                placeholder="FIND AN EXPERIENCE..." 
                className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-4 pl-12 rounded-full text-[9px] font-black tracking-widest outline-none focus:border-brandRed/50 transition-all text-white w-full md:w-80 shadow-2xl" 
                onChange={e => setSearch(e.target.value)} 
                value={search}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-950/40 backdrop-blur-xl rounded-full border border-white/10">
              {categories.map(c => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)} 
                  className={`px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${
                    filter === c 
                    ? 'bg-brandRed text-white shadow-lg shadow-brandRed/30' 
                    : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-40">
          <EventSection 
            title="Next Pulse" 
            subtitle="Secure your spot in the movement"
            icon={<Sparkles className="text-brandRed" size={20} />}
            items={upcoming} 
            isUpcoming={true} 
            cols="lg:grid-cols-3" 
          />

          <EventSection 
            title="The Archive" 
            subtitle="Historical gatherings of the tribe"
            icon={<History className="text-white" size={20} />}
            items={past} 
            isUpcoming={false} 
            cols="lg:grid-cols-4" 
            richVariant={true}
          />
        </div>

        {/* EMPTY STATE */}
        {upcoming.length === 0 && past.length === 0 && (
          <div className="py-32 text-center">
            <h2 className="text-zinc-900 font-black italic text-4xl uppercase tracking-tighter">No Matches Found</h2>
            <button onClick={() => {setFilter('ALL'); setSearch('');}} className="mt-6 text-brandRed font-mono text-[10px] tracking-[0.4em] uppercase flex items-center gap-2 mx-auto hover:gap-4 transition-all">
              Reset <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventSection({ title, subtitle, icon, items, isUpcoming }: any) {
  if (items.length === 0) return null;
  
  return (
    <div className="mb-24 w-full">
      <div className="flex flex-col gap-2 mb-12 border-l-2 border-brandRed/20 pl-6 text-white">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${isUpcoming ? 'text-white' : 'text-zinc-400'}`}>
            {title}
          </h2>
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] ml-8">{subtitle}</p>
      </div>

      {/* DYNAMIC WIDTH LOGIC:
          - Upcoming: grid-cols-3 (Balanced)
          - Past: grid-cols-2 (Significantly Wider)
      */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isUpcoming ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-10 w-full max-w-[1600px] mx-auto`}>
        <AnimatePresence mode='popLayout'>
          {items.map((item: any, index: number) => (
            <motion.div
              key={item._id || item.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="w-full"
            >
              <EventCard {...item} isUpcoming={isUpcoming} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}