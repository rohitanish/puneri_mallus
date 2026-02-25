"use client";
import { useState, useEffect } from 'react';
import { 
  Trash2, Edit3, Plus, Users, Globe, 
  Link as LinkIcon, Loader2, Camera, Zap, RefreshCcw 
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { logAdminActivity } from '@/app/admin/action';
import { useAlert } from '@/context/AlertContext';
import TribeConfirm from '@/components/TribeConfirm';

export default function CommunityAdmin() {
  const [circles, setCircles] = useState<any[]>([]);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  // Dialog States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [circleToDelete, setCircleToDelete] = useState<{id: string, title: string} | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState({ 
    title: '', tagline: '', description: '', 
    category: 'Music', link: '', image: '' 
  });

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      setCircles(data);
    } catch (error) {
      console.error("Load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCircles(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `circle-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('community').getPublicUrl(filePath);
      setForm({ ...form, image: data.publicUrl });
      showAlert("Asset processed successfully", "success");
    } catch (error: any) {
      showAlert('Upload failed: ' + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = isEditingId ? { ...form, _id: isEditingId } : form;
      const res = await fetch('/api/community/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await logAdminActivity(`${isEditingId ? 'Updated' : 'Initialized'} Circle: ${form.title}`, "COMMUNITY_UPDATE");
        resetForm();
        fetchCircles();
        showAlert(isEditingId ? "Circle Intelligence Updated" : "New Tribe Circle Initialized", "success");
      }
    } catch (error) {
      showAlert("Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const initiateDelete = (id: string, title: string) => {
    setCircleToDelete({ id, title });
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!circleToDelete) return;
    setConfirmOpen(false);
    try {
      const res = await fetch(`/api/community/delete?id=${circleToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        await logAdminActivity(`DISSOLVED: ${circleToDelete.title}`, "COMMUNITY_UPDATE");
        showAlert(`${circleToDelete.title} dissolved successfully`, "success");
        fetchCircles();
      }
    } catch (error) {
      showAlert("Dissolution failed", "error");
    } finally {
      setCircleToDelete(null);
    }
  };

  const startEdit = (circle: any) => {
    setIsEditingId(circle._id);
    const { _id, ...cleanData } = circle;
    setForm(cleanData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ title: '', tagline: '', description: '', category: 'Music', link: '', image: '' });
    setIsEditingId(null);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-16 text-white selection:bg-cyan-400/30">
      
      {/* TRIBE CONFIRM DIALOG */}
      <TribeConfirm 
        isOpen={confirmOpen}
        title="Dissolve Circle"
        message={`WARNING: You are about to permanently dissolve the "${circleToDelete?.title}" node. This will remove it from the public directory.`}
        onConfirm={executeDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: FORM PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 p-8 rounded-[40px] border border-white/5 sticky top-32 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-black">
                {isEditingId ? <Edit3 size={20}/> : <Plus size={20}/>}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {isEditingId ? 'Mod' : 'New'} <span className="text-cyan-400">Circle .</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Circle Name</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-cyan-400 transition-all outline-none uppercase" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>

              {/* SEARCHABLE CATEGORY */}
              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Sector // Pick or Type</label>
                <input 
                  list="circle-categories"
                  className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-cyan-400 outline-none uppercase tracking-widest"
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                />
                <datalist id="circle-categories">
                   <option value="Music & Jamming" />
                   <option value="Sports & Fitness" />
                   <option value="Arts & Culture" />
                   <option value="Tech & Business" />
                   <option value="Food & Travel" />
                </datalist>
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Display Poster</label>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                    {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <Camera className="text-zinc-800" size={24} />}
                  </div>
                  <label className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-cyan-400 hover:text-black transition-all group">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Asset</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Tagline (Pulse // Tribe)</label>
                <input required placeholder="E.G. RHYTHM OF THE STREETS" className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-cyan-400 outline-none uppercase" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} />
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">WhatsApp / Join Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input placeholder="https://chat.whatsapp.com/..." className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl font-bold focus:border-cyan-400 outline-none text-cyan-400" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Description</label>
                <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-cyan-400 outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <button type="submit" disabled={saving || uploading} className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : isEditingId ? 'Apply Update' : 'Initialize Circle'}
              </button>
              {isEditingId && <button onClick={resetForm} className="w-full text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Cancel Intelligence Update</button>}
            </form>
          </div>
        </div>

        {/* RIGHT: LIVE GRID */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Live <span className="text-cyan-400">Circles .</span></h2>
            <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">{circles.length} Active Nodes</p>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-cyan-400" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {circles.map((circle) => (
                <div key={circle._id} className="group relative bg-zinc-950 border border-white/5 rounded-[32px] overflow-hidden hover:border-cyan-400/30 transition-all duration-500">
                  <div className="h-48 relative">
                    <img src={circle.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <button onClick={() => startEdit(circle)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-cyan-500 rounded-xl transition-all"><Edit3 size={14}/></button>
                      <button onClick={() => initiateDelete(circle._id, circle.title)} className="p-3 bg-black/50 backdrop-blur-md hover:bg-red-600 rounded-xl transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="text-cyan-400 font-black uppercase text-[8px] tracking-[0.3em]">{circle.category || 'COMMUNITY'} // {circle.tagline}</span>
                    <h3 className="text-2xl font-black uppercase italic mb-3 tracking-tighter">{circle.title}</h3>
                    <p className="text-zinc-500 text-[11px] font-medium italic line-clamp-2 mb-6 leading-relaxed">{circle.description}</p>
                    <div className="flex items-center gap-3 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] border-t border-white/5 pt-6">
                      <Users size={14} className="text-cyan-400" /> Tribe Node Connected
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}