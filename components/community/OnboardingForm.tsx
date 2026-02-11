"use client";
import { useState } from 'react';
import { Briefcase, Heart, ScrollText, Rocket, Check, Loader2 } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: () => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onComplete();
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-24">
      <div className="max-w-xl w-full bg-zinc-900/40 border border-white/5 p-8 md:p-12 rounded-[40px] backdrop-blur-2xl relative overflow-hidden">
        {/* Aesthetic background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brandRed/10 blur-[100px] -z-10" />
        
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-3">
            Join the <span className="text-brandRed">Tribe</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Complete your social identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PROFESSION */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              <Briefcase size={14} className="text-brandRed" /> Profession / Role
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. FULL STACK DEVELOPER"
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-brandRed outline-none transition-all placeholder:text-zinc-700"
              value={formData.profession}
              onChange={e => setFormData({...formData, profession: e.target.value})}
            />
          </div>

          {/* INTERESTS */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              <Heart size={14} className="text-brandRed" /> Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(opt => {
                const isSelected = formData.interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      isSelected 
                        ? 'bg-brandRed border-brandRed text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' 
                        : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    {isSelected && <Check size={10} className="inline mr-1 mb-0.5" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BIO */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              <ScrollText size={14} className="text-brandRed" /> Bio
            </label>
            <textarea 
              required
              placeholder="Tell the Puneri Mallus tribe about yourself..."
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-brandRed outline-none min-h-[120px] resize-none transition-all placeholder:text-zinc-700"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          {/* SUBMIT */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Rocket size={18} />
                Activate Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}