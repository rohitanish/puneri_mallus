"use client";
import { useEffect, useState, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Crown, Star, Ticket, Store, CheckCircle2, 
  ArrowRight, Loader2, Sparkles, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

function MembershipSuccessContent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchUpdatedProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch the newly updated profile to show their VIP status and points
        const { data } = await supabase
          .from('profiles')
          .select('full_name, loyalty_points, is_member')
          .eq('id', user.id)
          .single();
        
        setProfile(data);
      }
      setLoading(false);
    }
    
    // Slight delay to ensure the backend Razorpay webhook/verify route has finished syncing
    const timer = setTimeout(fetchUpdatedProfile, 1500);
    return () => clearTimeout(timer);
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brandRed" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Forging Your VIP Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 px-6 selection:bg-brandRed/30 flex items-center justify-center relative overflow-hidden">
      
      {/* Cinematic Background Glow */}
      <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-brandRed/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
        
        {/* SUCCESS HEADER */}
        <div className="text-center mb-12 space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-yellow-500/20 blur-[30px] rounded-full" />
            <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30 relative z-10 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
              <Crown size={40} className="text-yellow-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-[#030303] z-20">
              <CheckCircle2 size={20} className="text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
              Welcome to the <br /><span className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">Inner Circle.</span>
            </h1>
            <p className="text-sm md:text-base font-bold text-zinc-400 uppercase tracking-widest mt-4">
              Identity Verified: <span className="text-white">{profile?.full_name || 'Tribe Member'}</span>
            </p>
          </div>
        </div>

        {/* VIP DASHBOARD CARD */}
        <div className="bg-zinc-950 border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ShieldCheck size={150} />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Loyalty Points Banner */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 flex items-center gap-2 mb-1">
                  <Star size={14} className="fill-yellow-500" /> Tribe Balance
                </p>
                <p className="text-xs font-bold text-zinc-400">Points available for your next booking</p>
              </div>
              <div className="text-3xl font-black text-white">
                {profile?.loyalty_points || 0} <span className="text-sm text-yellow-500">PTS</span>
              </div>
            </div>

            {/* Unlocked Benefits Grid */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Privileges Unlocked</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 border border-white/5 p-5 rounded-2xl flex gap-4 items-start hover:border-brandRed/30 transition-colors">
                  <div className="p-3 bg-brandRed/10 rounded-xl text-brandRed shrink-0"><Ticket size={20} /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm text-white tracking-wide">Tribe Pricing</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Exclusive discounts on all flagship events and more loyalty points.</p>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 p-5 rounded-2xl flex gap-4 items-start hover:border-cyan-400/30 transition-colors">
                  <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400 shrink-0"><Store size={20} /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm text-white tracking-wide">Mallu Mart Access</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Free lifetime access to list your business globally.</p>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 p-5 rounded-2xl flex gap-4 items-start hover:border-yellow-500/30 transition-colors">
                  <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0"><Sparkles size={20} /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm text-white tracking-wide">Priority Access</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Early bird access before public ticket sales begin.</p>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 p-5 rounded-2xl flex gap-4 items-start hover:border-zinc-300/30 transition-colors">
                  <div className="p-3 bg-zinc-800 rounded-xl text-white shrink-0"><ShieldCheck size={20} /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm text-white tracking-wide">Council Voting</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Power to vote on upcoming event concepts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/events" className="flex-1 bg-brandRed text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            Explore Events <ArrowRight size={16} />
          </Link>
          <Link href="/profile" className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 transition-all text-center">
            Go to Profile
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303] flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" /></div>}>
      <MembershipSuccessContent />
    </Suspense>
  );
}