"use client";
import { useState } from 'react';
import { Briefcase, Heart, ScrollText, Rocket, Check, Loader2, Save, X } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
interface OnboardingFormProps {
  userId: string;
  onComplete: (newData: any) => void;
  initialData?: any;     // Pass existing socialData here when editing
  isEditing?: boolean;   // Toggle UI for Edit mode
  onCancel?: () => void; // Function to close edit mode
}

export default function OnboardingForm({ 
  userId, 
  onComplete, 
  initialData, 
  isEditing = false, 
  onCancel 
}: OnboardingFormProps) {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  // Initialize state with initialData if it exists
  const [formData, setFormData] = useState({
    profession: initialData?.profession || '',
    bio: initialData?.bio || '',
    interests: initialData?.interests || [] as string[]
  });

  const interestOptions = [
    'Software', 'Design', 'Music', 'Foodie', 
    'Travel', 'Cricket', 'Networking', 'Arts', 'Fitness'
  ];

  const toggleInterest = (interest: string) => {
  setFormData(prev => ({
    ...prev,
    interests: prev.interests.includes(interest)
      ? prev.interests.filter((i: string) => i !== interest) // Added (i: string)
      : [...prev.interests, interest]
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
      showAlert("Please select at least one interest!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (res.ok) {
        onComplete(formData);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to sync profile");
      }
    } catch (error) {
      console.error(error);
      showAlert("Tribe connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-3">
          {isEditing ? 'Update' : 'Tribe'} <span className="text-brandRed">{isEditing ? 'Identity' : 'Activation'}</span>
        </h2>
        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
          {isEditing ? 'Refine your social presence' : 'Introduce yourself to the inner circle'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFESSION */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <Briefcase size={14} className="text-brandRed" /> Profession
          </label>
          <input 
            type="text" required
            placeholder="e.g. FULL STACK DEVELOPER"
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold focus:border-brandRed outline-none transition-all placeholder:text-zinc-800 uppercase"
            value={formData.profession}
            onChange={e => setFormData({...formData, profession: e.target.value.toUpperCase()})}
          />
        </div>

        {/* INTERESTS */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <Heart size={14} className="text-brandRed" /> Interests
          </label>
          <div className="flex flex-wrap gap-2">
  {/* Add (opt: string) to tell TS it's a string */}
  {interestOptions.map((opt: string) => {
    const isSelected = formData.interests.includes(opt);
    return (
      <button
        key={opt} 
        type="button"
        onClick={() => toggleInterest(opt)}
        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
          isSelected 
            ? 'bg-brandRed border-brandRed text-white' 
            : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
        }`}
      >
        {opt}
      </button>
    );
  })}
</div>
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
            <ScrollText size={14} className="text-brandRed" /> Tribe Bio
          </label>
          <textarea 
            required
            placeholder="Tell the tribe your story..."
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold focus:border-brandRed outline-none min-h-[100px] resize-none transition-all placeholder:text-zinc-800"
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          {isEditing && (
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-5 bg-zinc-900 text-zinc-500 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`flex-[2] py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 ${
              isEditing ? 'bg-white text-black hover:bg-brandRed hover:text-white' : 'bg-brandRed text-white hover:bg-white hover:text-black'
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isEditing ? <Save size={18} /> : <Rocket size={18} />}
                {isEditing ? 'Save Changes' : 'Activate Profile'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}