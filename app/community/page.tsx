"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Music, Sparkles, ArrowUpRight, Users, 
  Zap, Flame, Loader2, Search, Filter, X,
  Dumbbell, Utensils, Laptop, Camera
} from 'lucide-react';

const LaserDivider = () => (
  <div className="relative w-full h-px flex items-center justify-center overflow-visible my-8">
    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
    <div className="absolute w-[30%] h-[2px] bg-brandRed shadow-[0_0_20px_#FF0000] z-10" />
  </div>
);

// Helper function to render correct icon based on category string
const CategoryIcon = ({ category }: { category: string }) => {
  const cat = category?.toUpperCase();
  if (cat?.includes('MUSIC') || cat?.includes('JAM')) return <Music size={20} />;
  if (cat?.includes('SPORT') || cat?.includes('FIT')) return <Dumbbell size={20} />;
  if (cat?.includes('FOOD') || cat?.includes('EAT')) return <Utensils size={20} />;
  if (cat?.includes('TECH') || cat?.includes('DEV')) return <Laptop size={20} />;
  if (cat?.includes('PHOTO') || cat?.includes('ART')) return <Camera size={20} />;
  return <Sparkles size={20} />;
};

export default function CommunityPage() {
  const [circles, setCircles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    async function fetchCircles() {
      try {
        const res = await fetch('/api/community');
        const data = await res.json();
        setCircles(data);
      } catch (err) {
        console.error("Failed to load circles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCircles();
  }, []);

  // 1. DYNAMIC CATEGORY EXTRACTION
  const categories = useMemo(() => {
    const cats = circles.map(c => c.category?.toUpperCase() || "TRIBE");
    return ["ALL", ...Array.from(new Set(cats))];
  }, [circles]);

  // 2. FILTERING LOGIC
  const filteredCircles = useMemo(() => {
    return circles.filter(circle => {
      const matchesSearch = 
        circle.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        circle.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || circle.category?.toUpperCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, circles]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-brandRed" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-brandRed/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-brandRed/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-40 pb-20 px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-900 border border-white/5 rounded-full">
            <Zap size={14} className="text-brandRed" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              Community // <span className="text-white">Nodes</span>
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Our <span className="text-brandRed">Circles .</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-sm md:text-xl">
            Diverse Interests . One Soul
          </p>
        </div>

        {/* SEARCH & DISCOVERY BAR */}
        <div className="mb-20 space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* SEARCH */}
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={18} />
              <input 
                type="text"
                placeholder="FIND YOUR INTEREST..."
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

            {/* FILTER CHIPS */}
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

        {/* CIRCLES GRID */}
        {filteredCircles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
            {filteredCircles.map((circle) => (
              <div key={circle._id} className="group relative bg-zinc-950/40 border border-white/5 rounded-[40px] overflow-hidden transition-all duration-700 hover:border-brandRed/40 hover:bg-zinc-950/60 shadow-2xl backdrop-blur-xl">
                
                <div className="relative w-full h-80 overflow-hidden">
                  <Image 
                    src={circle.image || "/about/placeholder.jpeg"} 
                    alt={circle.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  {/* DYNAMIC ICON BOX */}
                  <div className="absolute top-8 left-8 bg-brandRed p-4 rounded-2xl shadow-2xl z-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10">
                    <CategoryIcon category={circle.category} />
                  </div>
                </div>

                <div className="p-10 space-y-8 relative z-10 text-left">
                  <div className="space-y-3">
                    <span className="text-brandRed font-black uppercase text-[10px] tracking-[0.4em] block">
                      {circle.category?.toUpperCase() || "TRIBE"} // {circle.tagline}
                    </span>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-brandRed transition-colors duration-500">
                      {circle.title}
                    </h2>
                    <p className="text-zinc-500 text-[13px] font-medium italic leading-relaxed min-h-[48px]">
                      {circle.description}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    {circle.link && circle.link.trim() !== "" ? (
                      <Link 
                        href={circle.link} 
                        target="_blank" 
                        className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest text-center hover:bg-brandRed hover:text-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
                      >
                        Join Circle <ArrowUpRight size={14} />
                      </Link>
                    ) : (
                      <div className="flex-1 py-5 rounded-2xl border border-white/5 bg-white/10 text-zinc-600 font-black uppercase text-[11px] tracking-widest text-center italic cursor-default">
                        Invitations Paused
                      </div>
                    )}
                    
                    <div className="px-6 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-brandRed/20 transition-all group-hover:bg-brandRed/10">
                       <Users className="text-zinc-600 group-hover:text-brandRed" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-zinc-950/20 mb-32 backdrop-blur-md">
            <Search size={40} className="text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">No Circles found in this node</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); }} className="mt-4 text-brandRed font-black uppercase text-[9px] hover:underline tracking-widest">Reset Radar</button>
          </div>
        )}

        {/* FOOTER STATS */}
        <div className="text-center">
          <LaserDivider />
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-12 opacity-50">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">{filteredCircles.length} Circles Active</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-brandRed" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tribe Pulse Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}