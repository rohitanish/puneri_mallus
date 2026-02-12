"use client";
import { useState } from 'react';
import { Briefcase, Heart, ScrollText, Rocket, Check, Loader2 } from 'lucide-react';

interface OnboardingFormProps {
  userId: string; // Pass the ID from Profile
  onComplete: (newData: any) => void;
}

export default function OnboardingForm({ userId, onComplete }: OnboardingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profession: '',
    bio: '',
    interests: [] as string[]
  });

  const interestOptions = [
    'Software', 'Design', 'Music', 'Foodie', 
    'Travel', 'Cricket', 'Networking', 'Arts', 'Fitness'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
      alert("Please select at least one interest!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }), // Explicitly pass userId
      });

      if (res.ok) {
        onComplete(formData);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to onboard");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-3">
          Tribe <span className="text-brandRed">Activation</span>
        </h2>
        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
          Introduce yourself to the inner circle
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <Briefcase size={14} className="text-brandRed" /> Profession
          </label>
          <input 
            type="text" required
            placeholder="e.g. FULL STACK DEVELOPER"
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold focus:border-brandRed outline-none transition-all placeholder:text-zinc-800"
            value={formData.profession}
            onChange={e => setFormData({...formData, profession: e.target.value.toUpperCase()})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <Heart size={14} className="text-brandRed" /> Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(opt => (
              <button
                key={opt} type="button"
                onClick={() => toggleInterest(opt)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  formData.interests.includes(opt) 
                    ? 'bg-brandRed border-brandRed text-white' 
                    : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <ScrollText size={14} className="text-brandRed" /> Bio
          </label>
          <textarea 
            required
            placeholder="Tell the tribe your story..."
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold focus:border-brandRed outline-none min-h-[100px] resize-none transition-all placeholder:text-zinc-800"
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-brandRed text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Rocket size={18} /> Activate Profile</>}
        </button>
      </form>
    </div>
  );
}