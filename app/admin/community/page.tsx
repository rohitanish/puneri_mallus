"use client";
import { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Edit3, Plus, Users, Globe, 
  Loader2, Search, X, MapPin, ShieldCheck, Zap
} from 'lucide-react';
import Link from 'next/link';
import TribeConfirm from '@/components/TribeConfirm';
import { useAlert } from '@/context/AlertContext';

export default function CommunityAdmin() {
  const [circles, setCircles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  const { showAlert } = useAlert();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      setCircles(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCircles(); }, []);

  const filteredCircles = useMemo(() => {
    return circles.filter(c => 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [circles, searchQuery]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/community/delete?id=${itemToDelete._id}`, { method: 'DELETE' });
      if (res.ok) {
        setCircles(circles.filter(c => c._id !== itemToDelete._id));
        showAlert("Node Dissolved", "success");
      }
    } catch (error) { showAlert("Action failed", "error"); }
    finally { setConfirmOpen(false); }
  };

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 lg:px-16 text-white">
      <TribeConfirm 
        isOpen={confirmOpen} 
        title="Dissolve Node" 
        message={`Remove "${itemToDelete?.title}" permanently?`} 
        onConfirm={handleDelete} 
        onCancel={() => setConfirmOpen(false)} 
      />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Network <span className="text-cyan-400">Hub .</span></h2>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                placeholder="SEARCH NODES..." 
                className="w-full bg-zinc-900 border border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-cyan-400"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/admin/community/list">
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2">
                <Plus size={16} /> Add Organization
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCircles.map((circle) => (
            <div key={circle._id} className="group bg-zinc-950 border border-white/5 rounded-[40px] overflow-hidden hover:border-cyan-400/30 transition-all">
              <div className="h-48 relative">
                <img src={circle.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                <div className="absolute top-4 right-4 flex gap-2">
                   <Link href={`/admin/community/list?edit=${circle._id}`} className="p-3 bg-black/60 backdrop-blur-md rounded-xl hover:text-cyan-400 transition-all"><Edit3 size={16}/></Link>
                   <button onClick={() => { setItemToDelete(circle); setConfirmOpen(true); }} className="p-3 bg-black/60 backdrop-blur-md rounded-xl hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="p-8">
                <span className="text-cyan-400 font-black text-[9px] uppercase tracking-widest">{circle.category}</span>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mt-1">{circle.title}</h3>
                <div className="flex items-center gap-2 mt-4 text-zinc-500 text-[10px] font-bold uppercase">
                  <MapPin size={12} /> {circle.area}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}