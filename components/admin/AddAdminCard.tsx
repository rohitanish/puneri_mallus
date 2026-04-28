"use client";

import { useState } from "react";
import { UserPlus, Loader2, ShieldCheck, MailCheck, AlertCircle } from "lucide-react";

export default function AddAdminCard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      // This calls the route that autogenerates the password and sends the email
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to authorize admin.");
      }

      setMessage({ 
        type: 'success', 
        text: `PROTOCOL SUCCESS: Credentials dispatched to ${email}` 
      });
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setMessage(null), 8000);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message.toUpperCase() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-950 border border-white/5 p-10 rounded-[40px] hover:border-brandRed/40 transition-all duration-700 h-full flex flex-col justify-between overflow-hidden group relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brandRed/20 to-transparent blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div>
        <div className="flex justify-between items-start mb-12">
          <div className="p-6 bg-black border border-white/5 rounded-[32px] group-hover:scale-110 group-hover:border-brandRed/30 transition-all duration-700">
            {loading ? (
              <Loader2 className="text-brandRed animate-spin" size={32} />
            ) : (
              <UserPlus className="text-brandRed" size={32} />
            )}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border text-brandRed border-brandRed/20 bg-brandRed/5">
            Admin Auth
          </span>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Gatekeeper</h3>
          <p className="text-zinc-500 font-bold italic text-sm leading-relaxed uppercase tracking-wider">
            Enter admin email. The system will <span className="text-white">auto-generate</span> secure credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              name="email"
              type="email"
              placeholder="TARGET ADMIN EMAIL"
              required
              suppressHydrationWarning
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-brandRed outline-none transition-all placeholder:text-zinc-800 disabled:opacity-50"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-brandRed hover:text-white transition-all uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>GENERATING ACCESS...</>
            ) : (
              <>GRANT ACCESS <ShieldCheck size={16} /></>
            )}
          </button>
        </form>
      </div>

      {message && (
        <div className={`mt-8 pt-6 border-t border-white/5 flex items-start gap-2 text-[9px] font-black uppercase tracking-widest leading-tight ${message.type === 'error' ? 'text-red-500' : 'text-brandRed'}`}>
          {message.type === 'error' ? <AlertCircle size={14} /> : <MailCheck size={14} />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}