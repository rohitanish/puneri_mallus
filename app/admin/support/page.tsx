"use client";
import { useState, useEffect } from 'react';
import { 
  Mail, Trash2, CheckCircle, Clock, 
  ArrowLeft, ExternalLink, Loader2, MessageSquare,
  ShieldCheck, Inbox
} from 'lucide-react';
import Link from 'next/link';
import { useAlert } from '@/context/AlertContext';

export default function SupportTerminal() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchTickets = async () => {
    const res = await fetch('/api/admin/support');
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/support', {
      method: 'PATCH',
      body: JSON.stringify({ id, status: newStatus }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      showAlert(`Ticket marked as ${newStatus}`, "success");
      fetchTickets();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-brandRed" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6 selection:bg-brandRed/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <Link href="/admin" className="text-zinc-600 hover:text-white uppercase font-black text-[10px] tracking-[0.4em] flex items-center gap-2 transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1" /> Return to Hub
            </Link>
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
              Support <br />
              <span className="text-brandRed">Terminal.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-6 py-3 rounded-2xl">
            <Inbox className="text-brandRed" size={20} />
            <span className="text-sm font-black uppercase tracking-widest">{tickets.length} Active Nodes</span>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tickets.length > 0 ? (
            tickets.map((ticket: any) => (
              <div key={ticket._id} className="bg-zinc-950 border border-white/5 p-10 rounded-[40px] relative group hover:border-brandRed/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brandRed/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-center mb-10">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] border ${ticket.status === 'OPEN' ? 'border-brandRed text-brandRed bg-brandRed/5' : 'border-zinc-800 text-zinc-600'}`}>
                    {ticket.status}
                  </div>
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Node ID: {ticket._id.slice(-6)}</span>
                </div>

                <div className="space-y-4 mb-10">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-brandRed transition-colors">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white">{ticket.name}</span>
                    <span className="text-zinc-800">//</span>
                    <span>{ticket.email}</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-6 rounded-3xl italic text-zinc-400 text-sm leading-relaxed relative">
                  <MessageSquare className="absolute -top-3 -left-3 text-brandRed/20" size={24} />
                  "{ticket.message}"
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  <a 
                    href={`mailto:${ticket.email}?subject=Re: ${ticket.subject}`}
                    className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-brandRed hover:text-white transition-all shadow-xl"
                  >
                    <Mail size={16} /> Respond
                  </a>
                  {ticket.status === 'OPEN' && (
                    <button 
                      onClick={() => updateStatus(ticket._id, 'RESOLVED')}
                      className="px-6 bg-zinc-900 border border-white/5 rounded-2xl hover:text-green-500 transition-colors"
                      title="Mark Resolved"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[50px]">
              <ShieldCheck className="mx-auto text-zinc-800 mb-6" size={60} />
              <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-xs">Terminal Clear // No Active Queries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}