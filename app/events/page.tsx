"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import EventCard from '@/components/EventCard';

export default function EventsPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH FROM MONGODB API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        // MongoDB stores IDs as _id, we map them for your EventCard if needed
        const formattedData = data.map((e: any) => ({
          ...e,
          id: e._id || e.id
        }));
        setEvents(formattedData);
      } catch (error) {
        console.error("Failed to load events from MongoDB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(e => 
    (filter === 'ALL' || e.category?.toUpperCase() === filter) && 
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="text-brandRed animate-spin mb-4" size={40} />
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Syncing Lineup...</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen pt-48 pb-20 px-6 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
          <div>
            <h1 className="text-8xl font-black italic uppercase tracking-tighter">
              The <span className="text-brandRed">Lineup.</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <input 
              placeholder="SEARCH..." 
              className="bg-zinc-900 border border-white/5 p-4 rounded-xl text-[10px] font-black tracking-widest outline-none focus:border-brandRed transition-all text-white" 
              onChange={e => setSearch(e.target.value)} 
            />
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
              {['ALL', 'CULTURAL', 'JAMMING'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)} 
                  className={`px-6 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all ${filter === c ? 'bg-brandRed text-white' : 'text-zinc-500'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* UPCOMING SECTION */}
        <EventSection 
          title="Upcoming Experiences" 
          items={filtered.filter(e => e.type?.toLowerCase() === 'upcoming')} 
          isUpcoming={true} 
          cols="lg:grid-cols-3" 
        />

        {/* ARCHIVE SECTION */}
        <div className="mt-24">
          <EventSection 
            title="The Archive" 
            items={filtered.filter(e => e.type?.toLowerCase() === 'past')} 
            isUpcoming={false} 
            cols="lg:grid-cols-5" 
          />
        </div>
      </div>
    </div>
  );
}

function EventSection({ title, items, isUpcoming, cols }: any) {
  if (items.length === 0) return null;
  
  return (
    <div className="mb-16">
      <h2 className={`text-2xl font-black uppercase italic mb-10 ${isUpcoming ? 'text-white' : 'text-zinc-800'}`}>
        {title}
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-3 ${cols} gap-6`}>
        <AnimatePresence mode='popLayout'>
          {items.map((item: any) => (
            <EventCard key={item.id} {...item} isUpcoming={isUpcoming} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}