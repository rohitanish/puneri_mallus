"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Handshake, Zap, ArrowUpRight, ExternalLink, 
  Loader2, Star, Instagram, Mail, Globe,
  MapPin, MessageCircle, Facebook, Search, Filter, X
} from 'lucide-react';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-8">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[30%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
  </div>
);

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        setPartners(data);
        setLoading(false);
      });
  }, []);

  // 1. EXTRACT UNIQUE CATEGORIES FOR FILTER BUTTONS
  const categories = useMemo(() => {
    const cats = partners.map(p => p.category?.toUpperCase() || "UNCATEGORIZED");
    return ["ALL", ...Array.from(new Set(cats))];
  }, [partners]);

  // 2. FILTER LOGIC
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesSearch = 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        partner.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || partner.category?.toUpperCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, partners]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-brandRed" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* 1. DYNAMIC GRADIENT BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-40 pb-20 px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-900 border border-white/5 rounded-full">
            <Handshake size={14} className="text-brandRed" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              Official // <span className="text-white">Allies</span>
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Tribe <span className="text-brandRed">Allies .</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-sm md:text-xl">
            Strategic Collaborations . Community Soul
          </p>
        </div>

        {/* SEARCH & FILTER MODULE */}
        <div className="mb-20 space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* SEARCH INPUT */}
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="text"
                placeholder="SEARCH BRANDS OR SECTORS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-brandRed/50 transition-all placeholder:text-zinc-700 backdrop-blur-md"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
              <Filter size={14} className="text-brandRed shrink-0 mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                    ? 'bg-brandRed border-brandRed text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' 
                    : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-brandRed/50 via-transparent to-transparent w-full" />
        </div>

        {/* DYNAMIC PARTNERS GRID */}
        {filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
            {filteredPartners.map((partner) => (
              <div key={partner._id} className="group relative bg-zinc-950/40 border border-white/5 rounded-[40px] overflow-hidden p-8 flex flex-col sm:flex-row gap-8 items-center transition-all hover:border-brandRed/40 shadow-2xl backdrop-blur-xl">
                
                {/* Logo Section */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center p-6 group-hover:border-brandRed/30 transition-all duration-500 shadow-inner">
                  <div className="relative w-full h-full">
                    <Image 
                      src={partner.image || "/placeholder.jpg"} 
                      alt={partner.name} 
                      fill 
                      className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="space-y-1">
                    <span className="text-brandRed font-black uppercase text-[10px] tracking-[0.3em]">
                      {partner.category}
                    </span>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                      {partner.name}
                    </h3>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium italic leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>
                  
                  {partner.perk && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brandRed/10 border border-brandRed/20 rounded-xl">
                      <Star size={12} className="text-brandRed fill-brandRed" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {partner.perk}
                      </span>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 pt-4 border-t border-white/5">
                    {partner.link && (
                      <Link href={partner.link} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                        <Globe size={14} className="text-brandRed" /> WEB
                      </Link>
                    )}
                    {partner.instagram && (
                      <Link href={`https://instagram.com/${partner.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                        <Instagram size={14} className="text-brandRed" /> INSTA
                      </Link>
                    )}
                    {partner.whatsapp && (
                      <Link href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#25D366] transition-all">
                        <MessageCircle size={14} className="text-[#25D366]" /> CHAT
                      </Link>
                    )}
                    {partner.email && (
                      <Link href={`mailto:${partner.email}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                        <Mail size={14} className="text-brandRed" /> MAIL
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-zinc-950/20 mb-32 backdrop-blur-md">
            <Search size={40} className="text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">No Allies found for this criteria</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); }} className="mt-4 text-brandRed font-black uppercase text-[9px] hover:underline tracking-widest">Reset Discovery</button>
          </div>
        )}

        {/* BOTTOM STATS */}
        <div className="text-center">
          <LaserDivider />
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-12 opacity-40">
            <div className="flex items-center gap-3">
              <Handshake size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">{filteredPartners.length} Nodes Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tribe Collaborations</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}