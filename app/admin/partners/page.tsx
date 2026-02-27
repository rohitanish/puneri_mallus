"use client";
import { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Edit3, Plus, Handshake, Globe, 
  Link as LinkIcon, Loader2, Camera, Star, 
  Instagram, Mail, MessageCircle, RefreshCcw, Search, X
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { logAdminActivity } from '@/app/admin/action';
import { useAlert } from '@/context/AlertContext';
import TribeConfirm from '@/components/TribeConfirm';

export default function PartnerAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showAlert } = useAlert();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetAlly, setTargetAlly] = useState<{id: string, name: string} | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState({ 
    name: '', category: '', description: '', 
    perk: '', link: '', image: '',
    email: '', instagram: '', whatsapp: '' 
  });

  const [countryCode, setCountryCode] = useState('91');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partners');
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("Load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  // --- SEARCH LOGIC ---
  const filteredPartners = useMemo(() => {
    return partners.filter(p => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [partners, searchQuery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `partner-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('partners').getPublicUrl(filePath);
      setForm({ ...form, image: data.publicUrl });
      
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
      const finalPayload = {
        ...form,
        whatsapp: form.whatsapp ? `${countryCode}${form.whatsapp.replace(/\D/g, '')}` : '',
        _id: isEditingId
      };

      const res = await fetch('/api/partners/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (res.ok) {
        await logAdminActivity(`${isEditingId ? 'Updated' : 'Onboarded'} Ally: ${form.name}`, "PARTNER_UPDATE");
        resetForm();
        fetchPartners();
        showAlert(isEditingId ? "Ally Updated!" : "New Ally Onboarded!", "success");
      }
    } catch (error) {
      showAlert("Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // --- DELETE LOGIC WITH TRIBE CONFIRM ---
  const requestDelete = (id: string, name: string) => {
    setTargetAlly({ id, name });
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!targetAlly) return;
    try {
      const res = await fetch(`/api/partners/delete?id=${targetAlly.id}`, { method: 'DELETE' });
      if (res.ok) {
        await logAdminActivity(`REMOVED ALLY: ${targetAlly.name}`, "PARTNER_UPDATE");
        fetchPartners();
        setConfirmOpen(false);
        showAlert("Ally Purged", "success");
      }
    } catch (error) {
      showAlert("Delete failed", "error");
    }
  };

  const startEdit = (partner: any) => {
    setIsEditingId(partner._id);
    const { _id, ...cleanData } = partner;
    
    let displayNum = cleanData.whatsapp || '';
    if (displayNum.startsWith('91')) {
        setCountryCode('91');
        displayNum = displayNum.substring(2);
    } else if (displayNum.startsWith('971')) {
        setCountryCode('971');
        displayNum = displayNum.substring(3);
    }

    setForm({
        ...form,
        ...cleanData,
        whatsapp: displayNum,
        email: cleanData.email || '',
        instagram: cleanData.instagram || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ name: '', category: '', description: '', perk: '', link: '', image: '', email: '', instagram: '', whatsapp: '' });
    setIsEditingId(null);
    setCountryCode('91');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>;

  return (
    /* Increased top padding from pt-32 to pt-48 to clear fixed Navbar */
    <div className="min-h-screen bg-black pt-48 pb-20 px-6 lg:px-16 text-white selection:bg-brandRed/30">
      
      <TribeConfirm 
        isOpen={confirmOpen}
        title="Purge Ally"
        message={`Confirm permanent removal of ${targetAlly?.name}?`}
        onConfirm={executeDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: FORM PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 p-8 rounded-[40px] border border-white/5 sticky top-32 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brandRed rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                {isEditingId ? <Edit3 size={20}/> : <Plus size={20}/>}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {isEditingId ? 'Mod' : 'New'} <span className="text-brandRed">Ally .</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Brand Name</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold tracking-widest focus:border-brandRed transition-all outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Category // Search & Type</label>
                <input 
                  list="full-category-options"
                  placeholder="E.G. MANUFACTURING..."
                  className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none uppercase tracking-widest transition-all" 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                />
                <datalist id="full-category-options">
                  <option value="Manufacturing & Production" /><option value="Automotive & Engineering" /><option value="Fine Dining & Cuisine" /><option value="Cafe & Bistro" /><option value="Digital Media Agency" /><option value="Tech & Software" /><option value="Community & Cultural Group" />
                </datalist>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-end ml-2 mb-1">
                  <label className="font-black uppercase tracking-widest text-zinc-600">Brand Logo</label>
                  <span className="text-brandRed font-black uppercase text-[8px] tracking-widest">Best: Square</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                    {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <Camera className="text-zinc-800" size={24} />}
                  </div>
                  <label className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-brandRed hover:text-white transition-all group">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Logo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">WhatsApp Contact</label>
                <div className="flex gap-2">
                  <select 
                    className="bg-black border border-white/10 p-4 rounded-xl font-bold text-brandRed outline-none w-24"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="91">🇮🇳 +91</option><option value="971">🇦🇪 +971</option><option value="44">🇬🇧 +44</option><option value="1">🇺🇸 +1</option>
                  </select>
                  <div className="relative flex-1">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input placeholder="Number only" className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl font-bold focus:border-brandRed outline-none" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                <div>
                    <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Email</label>
                    <input className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none" placeholder="office@brand.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                    <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Instagram</label>
                    <input className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none" placeholder="@username" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Official Website URL</label>
                <input placeholder="https://..." className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none text-brandRed" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Member Perk</label>
                <input placeholder="E.G. 15% OFF" className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none uppercase" value={form.perk} onChange={e => setForm({...form, perk: e.target.value})} />
              </div>

              <div className="space-y-1 text-[10px]">
                <label className="font-black uppercase tracking-widest text-zinc-600 ml-2">Description</label>
                <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl font-bold focus:border-brandRed outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <button type="submit" disabled={saving || uploading} className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : isEditingId ? 'Update Ally' : 'Onboard Ally'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: LIST PANEL */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Current <span className="text-brandRed">Allies .</span></h2>
            
            <div className="relative group w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brandRed" size={14} />
              <input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="SEARCH ALLIES..." 
                className="w-full bg-zinc-950 border border-white/5 p-3 pl-11 rounded-full text-[10px] font-bold uppercase tracking-widest focus:border-brandRed outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner._id} className="group relative bg-zinc-950 border border-white/5 rounded-[32px] overflow-hidden hover:border-brandRed/40 transition-all duration-500 p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shrink-0 shadow-2xl flex items-center justify-center p-2">
                      <img src={partner.image} alt={partner.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <span className="text-brandRed font-black uppercase text-[8px] tracking-[0.3em]">{partner.category}</span>
                      <h3 className="text-xl font-black uppercase italic truncate">{partner.name}</h3>
                      <p className="text-zinc-500 text-[10px] font-medium italic line-clamp-2 mb-2">{partner.description}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                    {partner.whatsapp && <MessageCircle size={14} className="text-zinc-600 hover:text-[#25D366] transition-colors" />}
                    {partner.instagram && <Instagram size={14} className="text-zinc-600 hover:text-pink-500 transition-colors" />}
                    {partner.email && <Mail size={14} className="text-zinc-600 hover:text-blue-400 transition-colors" />}
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => startEdit(partner)} className="p-2 bg-zinc-900 hover:bg-white hover:text-black rounded-lg transition-all"><Edit3 size={14}/></button>
                      <button onClick={() => requestDelete(partner._id, partner.name)} className="p-2 bg-zinc-900 hover:bg-red-600 rounded-lg transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}