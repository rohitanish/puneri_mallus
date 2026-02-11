"use client";
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import OnboardingForm from '@/components/community/OnboardingForm';

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initCommunity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);

      // --- THE BRIDGE CHECK ---
      const res = await fetch(`/api/profile/check?id=${user.id}`);
      const data = await res.json();
      setHasProfile(data.exists);
      setLoading(false);
    };

    initCommunity();
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // If MongoDB doesn't have their data, show the form
  if (!hasProfile) {
    return <OnboardingForm onComplete={() => setHasProfile(true)} />;
  }

  // If they are onboarded, show the actual Community Feed
  return (
    <div className="min-h-screen bg-black pt-32 px-6 text-white">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter">Tribe <span className="text-brandRed">Feed</span></h1>
      <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Welcome to the inner circle.</p>
      {/* Community Feed Content goes here */}
    </div>
  );
}