"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { 
  CheckCircle, ArrowRight, Loader2, ShieldCheck, 
  Instagram, Globe, MousePointer2, ArrowLeft, X, Image as ImageIcon, MapPin, Star, MessageCircle, Plus, Trash2, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import TribeConfirm from '@/components/TribeConfirm';

const FIXED_CATEGORIES = [
  "FOOD & BEVERAGE", "REAL ESTATE", "HEALTH & WELLNESS", "EDUCATION", 
  "IT SERVICES", "AUTOMOBILE", "BEAUTY & SALON", "HOME DECOR", 
  "LEGAL & FINANCE", "TRAVEL & TOURISM", "EVENT MANAGEMENT", "OTHER"
];

interface ServiceItem {
  id: string;
  name: string;
  desc: string;
}

interface UnifiedImage {
  id: string;
  type: 'existing' | 'new';
  path?: string;
  file?: File;
  previewUrl: string;
}

const Field = ({ label, icon: Icon, placeholder, value, onChange, type = "text", maxLength }: any) => (
  <div className="space-y-2 w-full group">
    <div className="flex items-center gap-2 ml-2">
      {Icon && <Icon size={14} className="text-brandRed" />}
      <label className="text-[11px] font-black uppercase text-white tracking-[0.2em]">{label}</label>
    </div>
    <input 
      type={type} value={value || ''} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
      className="w-full bg-zinc-900 border-2 border-white/20 rounded-2xl p-5 text-white font-bold outline-none focus:border-brandRed transition-all placeholder:text-zinc-600"
    />
  </div>
);

function ListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [gallery, setGallery] = useState<UnifiedImage[]>([]);
  const [initialPaths, setInitialPaths] = useState<string[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '' });

  const [formData, setFormData] = useState({
    name: '', category: '', customCategory: '', area: '', mapUrl: '', 
    description: '', contact: '', instagram: '',
    website: '', buttonText: '', buttonUrl: '',
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');
      setUser(user);

      if (editId) {
        try {
          const res = await fetch(`/api/mart`);
          const data = await res.json();
          const item = data.find((i: any) => i._id === editId);
          if (item) {
            const isCustomCat = !FIXED_CATEGORIES.includes(item.category);
            setFormData({
              ...item,
              category: isCustomCat ? "OTHER" : item.category,
              customCategory: isCustomCat ? item.category : '',
            });
            setShowOtherCategory(isCustomCat);
            setServices(item.services || []);
            const paths = item.imagePaths || (item.imagePath ? [item.imagePath] : []);
            setInitialPaths(paths);
            setGallery(paths.map((p: string) => ({
              id: p, type: 'existing', path: p,
              previewUrl: `https://bhfrgcphqmbocplfcvbg.supabase.co/storage/v1/object/public/mallu-mart/${p}`
            })));
          }
        } catch (err) { console.error(err); } finally { setFetching(false); }
      }
    };
    init();
  }, [editId, router, supabase]);

  const triggerAlert = (title: string, message: string) => {
    setConfirmConfig({ title, message });
    setConfirmOpen(true);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setFormData({ ...formData, contact: val });
    }
  };

  const validateStep1 = () => {
    const { name, category, area, mapUrl, customCategory } = formData;
    if (!name || !category || !area || !mapUrl) return false;
    if (category === "OTHER" && !customCategory) return false;
    return true;
  };

  const addService = () => {
    if (services.length >= 10) return triggerAlert("Limit Reached", "Max 10 services allowed.");
    setServices([...services, { id: Math.random().toString(), name: '', desc: '' }]);
  };

  const updateService = (id: string, field: 'name' | 'desc', val: string) => {
    if (field === 'desc' && val.length > 100) return;
    setServices(services.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (gallery.length + selected.length > 7) return triggerAlert("Gallery Limit", "Max 7 images.");
      const newImgs: UnifiedImage[] = selected.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        type: 'new' as const, file, previewUrl: URL.createObjectURL(file)
      }));
      setGallery([...gallery, ...newImgs]);
    }
  };

  const swapImages = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= gallery.length) return;
    const newGallery = [...gallery];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    setGallery(newGallery);
  };

  const makeThumbnail = (index: number) => {
    const newArr = [...gallery];
    const [selected] = newArr.splice(index, 1);
    setGallery([selected, ...newArr]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gallery.length === 0) return triggerAlert("Required", "Upload at least 1 image.");
    if (!formData.description) return triggerAlert("Required", "Add a business description.");
    if (formData.contact.length !== 10) return triggerAlert("Invalid Number", "Please enter a valid 10-digit WhatsApp number.");

    setLoading(true);
    try {
      const currentExistingPaths = gallery.filter(img => img.type === 'existing').map(img => img.path);
      const pathsToDelete = initialPaths.filter(path => !currentExistingPaths.includes(path));

      if (pathsToDelete.length > 0) {
        await supabase.storage.from('mallu-mart').remove(pathsToDelete);
      }

      const uploadPromises = gallery.map(async (img) => {
        if (img.type === 'existing') return img.path;
        const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
        const { data, error } = await supabase.storage.from('mallu-mart').upload(fileName, img.file!);
        if (error) throw error;
        return data.path;
      });
      const finalPaths = await Promise.all(uploadPromises);
      const finalCategory = formData.category === "OTHER" ? formData.customCategory : formData.category;
      
      const martData = { 
        ...formData, 
        category: finalCategory.toUpperCase(),
        imagePaths: finalPaths, 
        services,
        userEmail: user.email 
      };

      const res = await fetch('/api/mart', {
        method: editId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, userEmail: user.email, updatedData: martData } : martData),
      });

      if(res.ok) {
        setShowSuccessToast(true);
        setTimeout(() => router.push('/directory'), 2000);
      }
    } catch (err) { 
      triggerAlert("Error", "Failed to save data.");
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>;

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-40 pb-20 px-6">
      
      <TribeConfirm 
        isOpen={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Broadcast Successful</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 mb-16">
          {[1, 2].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-700 ${step >= s ? 'bg-brandRed shadow-[0_0_20px_#FF0000]' : 'bg-zinc-800'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
              <div className="flex justify-between items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none text-white">Business <span className="text-brandRed">Core</span></h1>
                <Link href="/directory" className="p-3 md:p-4 bg-zinc-900 rounded-2xl border border-white/10 hover:bg-brandRed transition-all"><X /></Link>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <Field label="Business Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="e.g. THE MALABAR KITCHEN" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-white tracking-[0.2em] ml-2">Market Sector</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => {
                        setFormData({...formData, category: e.target.value});
                        setShowOtherCategory(e.target.value === "OTHER");
                      }}
                      className="w-full bg-zinc-900 border-2 border-white/20 rounded-2xl p-5 text-white font-bold outline-none focus:border-brandRed h-[64px]"
                    >
                      <option value="">SELECT CATEGORY</option>
                      {FIXED_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <Field label="Operational Area" value={formData.area} onChange={(e: any) => setFormData({...formData, area: e.target.value})} placeholder="e.g. Baner" />
                </div>
                {showOtherCategory && (
                  <Field label="Custom Category" value={formData.customCategory} onChange={(e: any) => setFormData({...formData, customCategory: e.target.value})} placeholder="e.g. CONSULTANCY" />
                )}
                <Field label="Google Maps Link" icon={MapPin} value={formData.mapUrl} onChange={(e: any) => setFormData({...formData, mapUrl: e.target.value})} placeholder="Paste shared link..." />
                
                <button 
                  onClick={() => validateStep1() ? setStep(2) : triggerAlert("Required", "Fill all Step 1 fields.")} 
                  className="w-full py-8 bg-white text-black rounded-[30px] font-black uppercase tracking-[0.4em] text-sm hover:bg-brandRed hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  Next: Services & Visuals <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="flex items-center gap-4 md:gap-6">
                <button onClick={() => setStep(1)} className="p-3 md:p-4 bg-zinc-900 rounded-2xl border border-white/10 hover:bg-brandRed transition-all"><ArrowLeft /></button>
                <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none">Portfolio & <span className="text-brandRed">Work</span></h1>
              </div>

              <div className="bg-zinc-900/50 p-8 rounded-[40px] border-2 border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-3 text-brandRed"><Briefcase size={20} /><span className="text-[12px] font-black uppercase tracking-widest text-white">Specific Services ({services.length}/10)</span></div>
                   <button onClick={addService} className="p-3 bg-brandRed text-white rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full sm:w-auto"><Plus size={16}/> ADD SERVICE</button>
                </div>
                <div className="space-y-4">
                  {services.map((s) => (
                    <div key={s.id} className="flex flex-col md:flex-row gap-4 p-5 bg-black rounded-2xl border border-white/5 relative">
                        <input className="flex-1 bg-zinc-900 border border-white/10 rounded-xl p-3 text-[11px] font-bold text-white outline-none focus:border-brandRed" placeholder="Service Name" value={s.name} onChange={(e) => updateService(s.id, 'name', e.target.value)} />
                        <input className="flex-[2] bg-zinc-900 border border-white/10 rounded-xl p-3 text-[11px] text-zinc-400 outline-none focus:border-brandRed" placeholder="Short Description" value={s.desc} onChange={(e) => updateService(s.id, 'desc', e.target.value)} />
                        <button onClick={() => setServices(services.filter(x => x.id !== s.id))} className="p-3 text-zinc-600 hover:text-brandRed transition-colors flex justify-center"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-white tracking-[0.2em] ml-2">Business Narrative (Description)</label>
                <textarea 
                  className="w-full bg-zinc-900 border-2 border-white/20 rounded-[30px] p-8 text-white font-medium outline-none focus:border-brandRed transition-all min-h-[160px] italic leading-relaxed" 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Detail your professional expertise..." 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((img, idx) => (
                  <motion.div layout key={img.id} className={`relative aspect-square rounded-[35px] overflow-hidden border-4 bg-zinc-900 ${idx === 0 ? 'border-brandRed shadow-[0_0_30px_rgba(255,0,0,0.3)]' : 'border-white/20'}`}>
                    <img src={img.previewUrl} className="object-cover w-full h-full" alt="Preview" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                       <button onClick={() => makeThumbnail(idx)} className={`p-2.5 rounded-full ${idx === 0 ? 'bg-brandRed text-white' : 'bg-black/60 text-white/40'}`}><Star size={16} fill={idx === 0 ? "white" : "none"} /></button>
                       <button onClick={() => setGallery(gallery.filter(g => g.id !== img.id))} className="p-2.5 bg-black/60 text-white rounded-full hover:bg-brandRed transition-all"><X size={16}/></button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
                       <button onClick={() => swapImages(idx, idx - 1)} className="flex-1 bg-black/60 py-2 rounded-xl border border-white/10 flex justify-center"><ArrowLeft size={16}/></button>
                       <button onClick={() => swapImages(idx, idx + 1)} className="flex-1 bg-black/60 py-2 rounded-xl border border-white/10 flex justify-center"><ArrowRight size={16}/></button>
                    </div>
                  </motion.div>
                ))}
                {gallery.length < 7 && (
                  <label className="aspect-square border-4 border-dashed border-white/20 rounded-[35px] flex flex-col items-center justify-center bg-zinc-900 cursor-pointer hover:border-brandRed/50 transition-all">
                    <ImageIcon className="text-zinc-600 group-hover:text-brandRed mb-3" size={40} />
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-8">
                <Field label="Instagram ID" icon={Instagram} value={formData.instagram} onChange={(e: any) => setFormData({...formData, instagram: e.target.value})} placeholder="Username" />
                <Field label="WhatsApp (10 Digits)" icon={MessageCircle} value={formData.contact} onChange={handleContactChange} placeholder="9XXXXXXXXX" maxLength={10} />
                
                <button onClick={handleSubmit} disabled={loading} className="w-full py-9 bg-brandRed text-white rounded-[30px] font-black uppercase tracking-[0.5em] text-xs shadow-2xl disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : <>{editId ? 'Sync Updates' : 'Broadcast to Mart'}</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ListProfession() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>}>
      <ListContent />
    </Suspense>
  );
}