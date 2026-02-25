"use client";
import { useState, useEffect } from 'react';
import { 
  Instagram, Save, Link as LinkIcon, ImageIcon, 
  Loader2, ArrowLeft, Eye, Upload, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { logAdminActivity } from '@/app/admin/action'; // 1. Import the universal logger
import { useAlert } from '@/context/AlertContext';
export default function SocialAdmin() {
  const [posts, setPosts] = useState([
    { mediaUrl: '', link: '' },
    { mediaUrl: '', link: '' },
    { mediaUrl: '', link: '' }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetch('/api/settings/social')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const simplified = data.map((p: any) => ({
            mediaUrl: p.mediaUrl || (p.useLinkAsThumbnail === false ? p.manualThumb : p.mediaUrl) || '',
            link: p.link || ''
          }));
          setPosts(simplified);
        }
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingIdx(index);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `social-${Date.now()}-${index}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('events').getPublicUrl(filePath);
      updatePost(index, 'mediaUrl', data.publicUrl);

      // 2. LOG FILE UPLOAD
      await logAdminActivity(`Pulse Asset: ${fileName}`, "SOCIAL_UPDATE");
      
    } catch (error: any) {
      showAlert('Upload failed: ' + error.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts.map(p => ({ ...p, useLinkAsThumbnail: true })))
      });

      if (response.ok) {
        // 3. LOG THE SAVE ACTION
        // This makes the update visible in Tribe Records
        await logAdminActivity("Instagram Social Pulse", "SOCIAL_UPDATE");
        showAlert("Social Pulse Updated!");
      }
    } catch (err) {
      showAlert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updatePost = (index: number, key: string, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [key]: value };
    setPosts(newPosts);
  };

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg|mov)/i) || url?.includes("video");

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 uppercase font-black text-[10px] tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Portal
        </Link>
        
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Social <span className="text-brandRed">Pulse.</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Sync Instagram Content with Supabase Storage</p>
        </div>

        <div className="space-y-10">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-zinc-950 border border-white/5 p-8 rounded-[40px] flex flex-col lg:flex-row gap-10 items-center relative overflow-hidden">
              
              <div className="w-full lg:w-56 aspect-square rounded-[32px] bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xl">
                 {post.mediaUrl ? (
                    isVideo(post.mediaUrl) ? (
                      <video src={post.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                    )
                 ) : (
                   <div className="flex flex-col items-center gap-3">
                      <ImageIcon className="text-zinc-800" size={40} />
                   </div>
                 )}
                 {uploadingIdx === idx && (
                   <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="animate-spin text-brandRed" size={32} />
                   </div>
                 )}
                 <div className="absolute top-3 right-3 bg-brandRed text-[8px] font-black px-3 py-1.5 rounded-full uppercase">Preview</div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <h3 className="text-brandRed font-black uppercase text-[10px] tracking-[0.5em]">Slot 0{idx + 1}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Media Thumbnail Source</label>
                    <label className="text-[9px] font-black text-brandRed uppercase tracking-widest cursor-pointer hover:text-white transition-colors flex items-center gap-2">
                      <Upload size={12} /> {uploadingIdx === idx ? 'Uploading...' : 'Upload Image/Video'}
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, idx)} disabled={uploadingIdx !== null} />
                    </label>
                  </div>
                  <div className="relative group">
                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed" size={16} />
                    <input 
                      placeholder="Paste URL or upload file..." 
                      className="w-full bg-black border border-white/10 p-5 pl-14 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-[11px]"
                      value={post.mediaUrl || ''}
                      onChange={(e) => updatePost(idx, 'mediaUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Instagram Destination</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed" size={16} />
                    <input 
                      placeholder="Paste Instagram post URL..." 
                      className="w-full bg-black border border-white/10 p-5 pl-14 rounded-2xl outline-none focus:border-brandRed transition-all font-bold text-[11px]"
                      value={post.link || ''}
                      onChange={(e) => updatePost(idx, 'link', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={saving || uploadingIdx !== null}
          className="w-full mt-16 bg-brandRed text-white py-8 rounded-[32px] font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-[0_20px_60px_rgba(255,0,0,0.2)] active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Deploy Pulse Update</>}
        </button>
      </div>
    </div>
  );
}