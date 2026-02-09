"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', date: '', category: 'CULTURAL', type: 'upcoming', image: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('pm_events') || '[]');
    const newEvent = { ...form, id: Date.now() };
    localStorage.setItem('pm_events', JSON.stringify([newEvent, ...existing]));
    router.push('/events'); // Redirect to Events page
  };

  return (
    <div className="min-h-screen bg-black pt-40 flex justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-zinc-900/50 p-10 rounded-3xl border border-white/5 space-y-6">
        <h1 className="text-3xl font-black italic uppercase italic">Add <span className="text-brandRed">Event</span></h1>
        <input placeholder="EVENT TITLE" required className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold tracking-widest outline-none focus:border-brandRed" onChange={e => setForm({...form, title: e.target.value.toUpperCase()})} />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="DATE (e.g. MAR 15)" required className="bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none" onChange={e => setForm({...form, date: e.target.value})} />
          <select className="bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold" onChange={e => setForm({...form, category: e.target.value})}>
            <option value="CULTURAL">CULTURAL</option>
            <option value="JAMMING">JAMMING</option>
          </select>
        </div>
        <select className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold" onChange={e => setForm({...form, type: e.target.value})}>
          <option value="upcoming">UPCOMING</option>
          <option value="past">PAST (ARCHIVE)</option>
        </select>
        <input placeholder="IMAGE URL (e.g. /events/img.jpg)" required className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold" onChange={e => setForm({...form, image: e.target.value})} />
        <button type="submit" className="w-full py-4 bg-brandRed text-white font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all">Publish Event</button>
      </form>
    </div>
  );
}