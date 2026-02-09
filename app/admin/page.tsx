"use client";
import { useState, useEffect } from 'react';
import { Trash2, Star, Edit3, Save, X, RefreshCcw, Plus, Clock, MapPin, Link as LinkIcon } from 'lucide-react';
import EventCard from '@/components/EventCard';

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // 1. Updated State with mapUrl
  const [form, setForm] = useState({ 
    title: '', 
    date: '', 
    time: '', 
    location: '', 
    mapUrl: '', // Added mapUrl
    category: 'CULTURAL', 
    type: 'upcoming', 
    image: '', 
    featured: false, 
    description: '' 
  });

  useEffect(() => {
    const staticEvents = [
      { id: 101, title: "AGAM: THE DREAM TOUR", date: "NOV 20, 2025", time: "7:00 PM", location: "PUNE", mapUrl: "https://maps.google.com", category: "CULTURAL", type: "past", image: "/events/agam.jpg", featured: true, description: "A legendary night of Carnatic Rock." },
      { id: 104, title: "VALENTINE'S JAMMING NIGHT", date: "FEB 14, 2026", time: "7:30 PM", location: "PUNE", mapUrl: "https://maps.google.com", category: "JAMMING", type: "upcoming", image: "/events/valentine.jpg", featured: true, description: "Join us for a night of music and love." },
    ];

    const saved = localStorage.getItem('pm_events');
    if (!saved) {
      localStorage.setItem('pm_events', JSON.stringify(staticEvents));
      setEvents(staticEvents);
    } else {
      setEvents(JSON.parse(saved));
    }
  }, []);

  const saveAndRefresh = (newList: any[]) => {
    localStorage.setItem('pm_events', JSON.stringify(newList));
    setEvents(newList);
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value;
    if (!rawDate) return;
    const dateObj = new Date(rawDate);
    const formatted = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase(); 
    setForm({ ...form, date: formatted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updated = events.map(ev => ev.id === isEditing ? { ...form, id: isEditing } : ev);
      saveAndRefresh(updated);
      setIsEditing(null);
    } else {
      const newEvent = { ...form, id: Date.now() };
      saveAndRefresh([newEvent, ...events]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ title: '', date: '', time: '', location: '', mapUrl: '', category: 'CULTURAL', type: 'upcoming', image: '', featured: false, description: '' });
    setIsEditing(null);
  };

  const startEdit = (event: any) => {
    setIsEditing(event.id);
    setForm({ 
        ...event,
        mapUrl: event.mapUrl || '' // Ensure mapUrl is handled for old events
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEvent = (id: number) => {
    if (confirm("Delete this event forever?")) {
      saveAndRefresh(events.filter(e => e.id !== id));
    }
  };

  const toggleFeatured = (id: number) => {
    saveAndRefresh(events.map(e => e.id === id ? { ...e, featured: !e.featured } : e));
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-16 text-white text-[10px]">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT SIDE: COMMAND FORM */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 p-8 rounded-[32px] border border-white/5 sticky top-32 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brandRed rounded-xl flex items-center justify-center text-white">
                {isEditing ? <Edit3 size={20}/> : <Plus size={20}/>}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {isEditing ? 'Update' : 'Create'} <span className="text-brandRed">Event</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Event Title</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-brandRed transition-all outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value.toUpperCase()})} />
              </div>

              {/* LOCATION & MAP URL */}
              <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Venue Name</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input placeholder="E.G. KOREGAON PARK" required className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl font-bold tracking-widest focus:border-brandRed outline-none uppercase" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Google Maps Link</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input placeholder="PASTE URL HERE..." className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl font-bold tracking-widest focus:border-brandRed outline-none" value={form.mapUrl} onChange={e => setForm({...form, mapUrl: e.target.value})} />
                    </div>
                </div>
              </div>

              {/* DATE & TIME PICKERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2 group-hover:text-brandRed transition-colors">Choose Date</label>
                    <div className="relative flex flex-col">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 z-10 w-10 h-10 bg-brandRed/10 rounded-xl flex items-center justify-center border border-brandRed/20 pointer-events-none">
                                <RefreshCcw className="text-brandRed" size={18} />
                            </div>
                            <input type="date" required className="w-full bg-black border-2 border-white/5 p-4 pl-16 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-brandRed transition-all [color-scheme:dark] cursor-pointer text-transparent [&::-webkit-datetime-edit]:text-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full" onChange={handleDateChange} />
                            <div className="absolute left-16 pointer-events-none">
                                <p className="text-[10px] font-black text-white tracking-widest uppercase">{form.date || "SELECT DATE"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2 group-hover:text-brandRed transition-colors">Set Time</label>
                    <div className="relative flex flex-col">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 z-10 w-10 h-10 bg-brandRed/10 rounded-xl flex items-center justify-center border border-brandRed/20 pointer-events-none">
                                <Clock className="text-brandRed" size={18} />
                            </div>
                            <input type="time" required className="w-full bg-black border-2 border-white/5 p-4 pl-16 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-brandRed transition-all [color-scheme:dark] cursor-pointer text-transparent [&::-webkit-datetime-edit]:text-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full" onChange={(e) => setForm({ ...form, time: formatDisplayTime(e.target.value) })} />
                            <div className="absolute left-16 pointer-events-none">
                                <p className="text-[10px] font-black text-white tracking-widest uppercase">{form.time || "SET TIME"}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* CATEGORY & TIMELINE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Category</label>
                  <select className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold cursor-pointer outline-none focus:border-brandRed" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="CULTURAL">CULTURAL</option>
                    <option value="JAMMING">JAMMING</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Timeline</label>
                  <select className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold cursor-pointer outline-none focus:border-brandRed" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="upcoming">UPCOMING</option>
                    <option value="past">PAST</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Description</label>
                <textarea placeholder="TELL THE STORY..." className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-brandRed transition-all outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              {/* IMAGE URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Image URL</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold outline-none focus:border-brandRed" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>

              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all border border-white/5">
                <input type="checkbox" className="accent-brandRed w-4 h-4" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pin to Home Glimpse</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 py-4 bg-brandRed text-white font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95">
                  {isEditing ? 'Save Changes' : 'Publish to Pulse'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all">
                    <X size={16}/>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: LIVE DATABASE */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Live <span className="text-zinc-800 text-outline">Database.</span></h2>
            <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">{events.length} Objects Loaded</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {events.map((event) => (
              <div key={event.id} className="relative group">
                <div className="absolute top-4 right-4 z-40 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button onClick={() => toggleFeatured(event.id)} className={`p-3 rounded-full backdrop-blur-md transition-all ${event.featured ? 'bg-brandRed shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'bg-black/50 hover:bg-brandRed'}`}>
                    <Star size={14} fill={event.featured ? "white" : "none"} />
                  </button>
                  <button onClick={() => startEdit(event)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-blue-600 rounded-full transition-all">
                    <Edit3 size={14}/>
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-red-600 rounded-full transition-all">
                    <Trash2 size={14}/>
                  </button>
                </div>
                <div className="pointer-events-none transition-all duration-500 scale-[0.98] group-hover:scale-100 group-hover:opacity-100 opacity-80">
                  <EventCard {...event} isUpcoming={event.type === 'upcoming'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}