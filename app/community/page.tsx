"use client";
import { Users, ShieldCheck, Zap } from 'lucide-react';

export default function CommunityPage() {
  const stats = [
    { label: "Active Members", value: "5000+", icon: <Users className="text-brandRed" /> },
    { label: "Events Hosted", value: "50+", icon: <Zap className="text-brandRed" /> },
    { label: "Verified Partners", value: "25+", icon: <ShieldCheck className="text-brandRed" /> },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-7xl font-black uppercase tracking-tighter mb-20 text-center">
          The <span className="text-brandRed">Circle</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-12 bg-zinc-950 border border-white/5 rounded-[50px] text-center">
              <div className="mb-6">{stat.icon}</div>
              <div className="text-6xl font-black mb-2">{stat.value}</div>
              <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-brandRed p-20 rounded-[60px] text-center space-y-8 shadow-[0_0_100px_rgba(255,0,0,0.2)]">
          <h2 className="text-5xl font-black uppercase">Ready to join the tribe?</h2>
          <button className="bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 transition">Join WhatsApp Group</button>
        </div>
      </div>
    </main>
  );
}