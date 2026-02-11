"use client";
import { useState, useEffect } from 'react';
import { 
  Trash2, Star, Edit3, X, RefreshCcw, Plus, 
  Clock, MapPin, Link as LinkIcon, Loader2, Camera 
} from 'lucide-react';
import EventCard from '@/components/EventCard';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState({ 
    title: '', date: '', time: '', location: '', mapUrl: '', 
    category: 'CULTURAL', type: 'upcoming', image: '', featured: false, description: '' 
  });

  const fetchFromMongo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFromMongo(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('events').getPublicUrl(filePath);
      const safeUrl = data.publicUrl.replace(/\\/g, '/');
      setForm({ ...form, image: safeUrl });
      
    } catch (error: any) {
      console.error('Storage Error:', error);
      alert('Upload failed. Ensure "events" bucket is Public in Supabase.');
    } finally {
      setUploading(false);
      setFileInputKey(Date.now());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // FIXED: Consolidating properties to avoid duplicate keys warning
    const sanitizedPayload = {
      ...form,
      title: form.title.trim().toUpperCase(),
      location: form.location.trim().toUpperCase(),
      image: form.image.trim() || '/events/placeholder.jpg' // This replaces the one from ...form
    };

    try {
      const payload = isEditingId ? { ...sanitizedPayload, _id: isEditingId } : sanitizedPayload;
      const res = await fetch('/api/events/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        resetForm();
        fetchFromMongo();
      }
    } catch (error) {
      alert("Failed to save event");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event from the cloud forever?")) return;
    try {
      const res = await fetch(`/api/events/delete?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFromMongo();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const toggleFeatured = async (event: any) => {
    try {
      const res = await fetch('/api/events/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, featured: !event.featured })
      });
      if (res.ok) fetchFromMongo();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (event: any) => {
    setIsEditingId(event._id);
    const { _id, ...cleanData } = event;
    setForm(cleanData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ title: '', date: '', time: '', location: '', mapUrl: '', category: 'CULTURAL', type: 'upcoming', image: '', featured: false, description: '' });
    setIsEditingId(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value;
    if (!rawDate) return;
    const formatted = new Date(rawDate).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric'
    }).toUpperCase(); 
    setForm({ ...form, date: formatted });
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-16 text-white text-[10px]">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 p-8 rounded-[32px] border border-white/5 sticky top-32 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brandRed rounded-xl flex items-center justify-center text-white">
                {isEditingId ? <Edit3 size={20}/> : <Plus size={20}/>}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {isEditingId ? 'Update' : 'Create'} <span className="text-brandRed">Event</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Event Title</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-brandRed transition-all outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value.toUpperCase()})} />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Event Poster</label>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {form.image ? (
                      <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera className="text-zinc-800" size={24} />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <label className="flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-brandRed hover:text-white transition-all group">
                      {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} className="text-brandRed group-hover:text-white" />}
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {uploading ? 'Uploading...' : 'Upload from Device'}
                      </span>
                      <input key={fileInputKey} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {form.image && <p className="text-[7px] text-green-500 font-bold uppercase tracking-widest px-2">✓ Cloud Link Active</p>}
                  </div>
                </div>
              </div>

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
                    <input placeholder="PASTE URL HERE..." className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl font-bold tracking-widest focus:border-brandRed outline-none text-blue-400" value={form.mapUrl} onChange={e => setForm({...form, mapUrl: e.target.value})} />
                  </div>
                </div>
              </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* DATE PICKER */}
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Date</label>
    <div className="relative h-16 group">
      {/* The Visual Box */}
      <div className="absolute inset-0 bg-black border-2 border-white/5 rounded-2xl flex items-center px-4 group-hover:border-brandRed/50 transition-all pointer-events-none">
        <div className="w-10 h-10 bg-brandRed/10 rounded-xl flex items-center justify-center border border-brandRed/20">
          <RefreshCcw className="text-brandRed" size={18} />
        </div>
        <span className="ml-4 text-white tracking-widest font-black uppercase text-[10px]">
          {form.date || "SELECT DATE"}
        </span>
      </div>

      {/* The Hidden Input stretched over the whole box */}
      <input 
        type="date" 
        required 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
        onChange={handleDateChange}
        // This line is the magic for mobile/Chrome:
        onClick={(e) => (e.target as any).showPicker?.()} 
      />
    </div>
  </div>

  {/* TIME PICKER */}
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Time</label>
    <div className="relative h-16 group">
      {/* The Visual Box */}
      <div className="absolute inset-0 bg-black border-2 border-white/5 rounded-2xl flex items-center px-4 group-hover:border-brandRed/50 transition-all pointer-events-none">
        <div className="w-10 h-10 bg-brandRed/10 rounded-xl flex items-center justify-center border border-brandRed/20">
          <Clock className="text-brandRed" size={18} />
        </div>
        <span className="ml-4 text-white tracking-widest font-black uppercase text-[10px]">
          {form.time || "SET TIME"}
        </span>
      </div>

      {/* The Hidden Input stretched over the whole box */}
      <input 
        type="time" 
        required 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
        onChange={(e) => setForm({ ...form, time: formatDisplayTime(e.target.value) })}
        onClick={(e) => (e.target as any).showPicker?.()}
      />
    </div>
  </div>
</div>

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

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Description</label>
                <textarea placeholder="TELL THE STORY..." className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-brandRed transition-all outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer border border-white/5">
                <input type="checkbox" className="accent-brandRed w-4 h-4" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pin to Home Glimpse</span>
              </label>

              <button type="submit" disabled={uploading} className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {isEditingId ? 'Save Changes' : 'Publish'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Live Database.</h2>
            <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">{events.length} Objects Loaded</p>
          </div>
          {loading ? <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" size={40} /></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
              {events.map((event) => (
                <div key={event._id} className="relative group">
                  <div className="absolute top-4 right-4 z-40 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button onClick={() => toggleFeatured(event)} className={`p-3 rounded-full backdrop-blur-md transition-all ${event.featured ? 'bg-brandRed shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'bg-black/50 hover:bg-brandRed'}`}><Star size={14} fill={event.featured ? "white" : "none"} /></button>
                    <button onClick={() => startEdit(event)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-blue-600 rounded-full transition-all"><Edit3 size={14}/></button>
                    <button onClick={() => deleteEvent(event._id)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-red-600 rounded-full transition-all"><Trash2 size={14}/></button>
                  </div>
                  <div className="pointer-events-none opacity-80 group-hover:opacity-100 transition-all"><EventCard {...event} isUpcoming={event.type === 'upcoming'} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}