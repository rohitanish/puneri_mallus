"use client";
import { useState, useEffect } from 'react';
import { Camera, Save, Loader2, ArrowLeft, Upload, Trash2, X, Plus, Calendar, Image as ImageIcon, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { logAdminActivity } from '@/app/admin/action';
import { useAlert } from '@/context/AlertContext';
import TribeConfirm from '@/components/TribeConfirm';

interface GalleryEvent {
  id: string;
  title: string;
  year: number;
  description: string;
  images: string[];
}

export default function GalleryAdmin() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Global Display States
  const [displayMode, setDisplayMode] = useState<'MIX' | 'SPECIFIC'>('MIX');
  const [featuredEventId, setFeaturedEventId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showAlert } = useAlert();
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetAction, setTargetAction] = useState<{type: 'EVENT' | 'IMAGE', eventId: string, imgIdx?: number} | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/settings/gallery');
        const data = await res.json();
        
        if (data && Array.isArray(data.events)) {
          setEvents(data.events);
          if (data.events.length > 0) setSelectedEventId(data.events[0].id);
        }
        
        if (data.displayMode) setDisplayMode(data.displayMode);
        if (data.featuredEventId) setFeaturedEventId(data.featuredEventId);

      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchGallery();
  }, []);

  const handleAddEvent = () => {
    const newEvent: GalleryEvent = {
      id: `ev_${Date.now()}`,
      title: 'New Event',
      year: new Date().getFullYear(), 
      description: '',
      images: []
    };
    setEvents([newEvent, ...events]);
    setSelectedEventId(newEvent.id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedEventId) return;
    
    const activeEvent = events.find(ev => ev.id === selectedEventId);
    if (!activeEvent) return;

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (activeEvent.images.length + files.length > 15) {
      showAlert("You can only upload a maximum of 15 photos per event.", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const safeTitle = activeEvent.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        const filePath = `about-gallery/${activeEvent.year}/${safeTitle}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('assets') 
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      setEvents(events.map(ev => 
        ev.id === selectedEventId 
        ? { ...ev, images: [...ev.images, ...uploadedUrls] } 
        : ev
      ));

      showAlert(`${files.length} photo(s) uploaded successfully!`, "success");
      
    } catch (error: any) {
      showAlert('Upload failed. Please try again.', "error");
    } finally {
      setUploading(false);
      if(e.target) e.target.value = ''; 
    }
  };

  const executeClear = () => {
    if (!targetAction) return;

    if (targetAction.type === 'EVENT') {
      const updatedEvents = events.filter(e => e.id !== targetAction.eventId);
      setEvents(updatedEvents);
      if (selectedEventId === targetAction.eventId) {
        setSelectedEventId(updatedEvents.length > 0 ? updatedEvents[0].id : null);
      }
      if (featuredEventId === targetAction.eventId) {
        setFeaturedEventId(null);
      }
      showAlert("Event deleted successfully.", "info");
    } 
    else if (targetAction.type === 'IMAGE' && targetAction.imgIdx !== undefined) {
      setEvents(events.map(ev => {
        if (ev.id === targetAction.eventId) {
          const newImages = [...ev.images];
          newImages.splice(targetAction.imgIdx!, 1);
          return { ...ev, images: newImages };
        }
        return ev;
      }));
      showAlert("Photo removed.", "info");
    }
    
    setConfirmOpen(false);
    setTargetAction(null);
  };

  const handleSave = async () => {
    for (let ev of events) {
      if (!ev.title.trim() || !ev.year) {
        showAlert("Please make sure all events have a title and a year.", "error");
        return;
      }
    }

    if (displayMode === 'SPECIFIC' && !featuredEventId) {
      showAlert("Please select which event you want to feature.", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/settings/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          events,
          displayMode, 
          featuredEventId 
        })
      });

      if (response.ok) {
        await logAdminActivity("Event Gallery Updated", "GALLERY_UPDATE");
        showAlert("Gallery saved successfully!", "success");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) { 
      showAlert("Failed to save changes. Please check your connection.", "error"); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>;

  const activeEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 flex flex-col md:flex-row gap-8">
      
      <TribeConfirm 
        isOpen={confirmOpen}
        title="Confirm Deletion"
        message={targetAction?.type === 'EVENT' ? "Are you sure you want to completely delete this event and all its photos?" : "Are you sure you want to remove this photo? It will be permanently deleted when you click 'Save Changes'."}
        onConfirm={executeClear}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* LEFT SIDEBAR - EVENT LIST */}
      <div className="w-full md:w-80 shrink-0 space-y-6 flex flex-col h-full md:h-[calc(100vh-160px)] md:sticky top-32">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
            The <span className="text-brandRed">Gallery.</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Manage your event photos here.</p>
        </div>

        {/* DEFAULT DISPLAY SETTINGS */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings2 size={16} className="text-brandRed" /> What should users see first?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Choose what shows up when a user first visits the About page.
          </p>
          <div className="flex bg-black rounded-xl p-1.5 border border-zinc-800">
            <button
              onClick={() => setDisplayMode('MIX')}
              className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${displayMode === 'MIX' ? 'bg-brandRed text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
            >
              Mix All Photos
            </button>
            <button
              onClick={() => setDisplayMode('SPECIFIC')}
              className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${displayMode === 'SPECIFIC' ? 'bg-brandRed text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
            >
              One Event
            </button>
          </div>

          {displayMode === 'SPECIFIC' && (
            <div className="pt-2">
              <select
                value={featuredEventId || ''}
                onChange={(e) => setFeaturedEventId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-brandRed focus:ring-1 focus:ring-brandRed transition-all cursor-pointer"
              >
                <option value="" disabled>Select an event to show...</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.year} - {ev.title || 'Untitled'}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button onClick={handleAddEvent} className="w-full py-4 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-white hover:border-brandRed hover:bg-brandRed/10 transition-all font-bold text-sm shadow-md">
          <Plus size={18} /> Add New Event
        </button>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {events.map(ev => (
            <div 
              key={ev.id} 
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${selectedEventId === ev.id ? 'bg-zinc-800 border-brandRed shadow-lg' : 'bg-black border-zinc-800 hover:border-zinc-600'}`}
            >
              <div className="overflow-hidden pr-2">
                <p className="font-bold text-white text-base truncate">{ev.title || 'Untitled Event'}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mt-1">
                  <Calendar size={12} className="text-brandRed" /> {ev.year} • <ImageIcon size={12} /> {ev.images.length}/15 photos
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setTargetAction({ type: 'EVENT', eventId: ev.id }); setConfirmOpen(true); }}
                className="text-zinc-500 hover:text-brandRed opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-brandRed/10 rounded-lg"
                title="Delete Event"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving || uploading} 
          className="w-full mt-auto bg-brandRed text-white py-5 rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Save All Changes</>}
        </button>
      </div>

      {/* RIGHT AREA - EVENT EDITOR */}
      <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-6 md:p-10 min-h-[500px] shadow-2xl">
        {activeEvent ? (
          <div className="space-y-10">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-zinc-400 ml-1">Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Onam 2024"
                  value={activeEvent.title} 
                  onChange={(e) => setEvents(events.map(ev => ev.id === activeEvent.id ? {...ev, title: e.target.value} : ev))}
                  className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl font-bold text-white text-lg focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 ml-1">Year</label>
                <input 
                  type="number" 
                  value={activeEvent.year} 
                  onChange={(e) => setEvents(events.map(ev => ev.id === activeEvent.id ? {...ev, year: parseInt(e.target.value) || 0} : ev))}
                  className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl font-bold text-brandRed text-lg focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                />
              </div>
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-bold text-zinc-400 ml-1">Short Description</label>
                <textarea 
                  rows={2}
                  placeholder="A brief description of this event..."
                  value={activeEvent.description} 
                  onChange={(e) => setEvents(events.map(ev => ev.id === activeEvent.id ? {...ev, description: e.target.value} : ev))}
                  className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl font-medium text-white text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all resize-none placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Photos Section */}
            <div className="pt-8 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white">Event Photos</h3>
                  <p className="text-zinc-400 text-sm mt-1">{activeEvent.images.length} out of 15 photos uploaded</p>
                </div>
                
                <label className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${activeEvent.images.length >= 15 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-brandRed text-white hover:bg-white hover:text-black cursor-pointer shadow-lg active:scale-95'}`}>
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <><Upload size={18} /> Upload Photos</>}
                  <input type="file" multiple accept="image/*" className="hidden" disabled={uploading || activeEvent.images.length >= 15} onChange={handleFileUpload} />
                </label>
              </div>

              {activeEvent.images.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-[30px] bg-zinc-950/50">
                  <Camera size={56} className="text-zinc-700 mb-4" />
                  <p className="text-zinc-400 font-bold text-base">No photos uploaded yet</p>
                  <p className="text-zinc-600 text-sm mt-2">Click the upload button above to add images.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeEvent.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl bg-zinc-950 border border-zinc-700 overflow-hidden relative group shadow-lg">
                      <img src={img} className="w-full h-full object-cover" alt={`Event Photo ${idx + 1}`} />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          onClick={() => { setTargetAction({ type: 'IMAGE', eventId: activeEvent.id, imgIdx: idx }); setConfirmOpen(true); }}
                          className="px-4 py-2 bg-brandRed text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <ImageIcon size={64} className="text-zinc-600 mb-4" />
            <p className="text-white font-bold text-xl mb-2">No Event Selected</p>
            <p className="text-zinc-400 text-sm">Select an event from the left menu or create a new one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}