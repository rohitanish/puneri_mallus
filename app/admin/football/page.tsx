"use client";
import { useState, useEffect } from 'react';
import { Trophy, Save, Loader2, IndianRupee, Search, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

export default function AdminFootballTeams() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  
  const [teams, setTeams] = useState<any[]>([]);
  const [footballFee, setFootballFee] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, teamsRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/admin/football') // Creates a simple GET route grabbing from football_teams
        ]);
        
        const settings = await settingsRes.json();
        const teamsData = await teamsRes.json();

        if (settings && !settings.error) {
          setFootballFee(settings.footballFee || settings.football_fee || 0);
        }
        if (Array.isArray(teamsData)) setTeams(teamsData);

      } catch (err) {
        showAlert("Failed to load records", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveFee = async () => {
    setSaving(true);
    try {
      // Assuming your settings API takes a partial object to update
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ football_fee: footballFee }) 
      });
      if (res.ok) showAlert("Registration Fee Updated", "success");
      else throw new Error();
    } catch (err) {
      showAlert("Transmission Error", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.rep_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-brandRed" size={30} /></div>;

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER & SETTINGS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Tournament <span className="text-brandRed">Admin .</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Team Roster & Financials</p>
          </div>
          
          <div className="bg-zinc-950 border border-white/10 p-6 rounded-3xl w-full lg:w-96 flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <IndianRupee size={14} className="text-brandRed" /> Entry Fee Configuration
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={footballFee === 0 || isNaN(footballFee) ? '' : footballFee} 
                onChange={e => setFootballFee(parseInt(e.target.value) || 0)} 
                className="w-full bg-black border border-white/10 p-4 rounded-xl text-xl font-black italic focus:border-brandRed outline-none" 
              />
              <button 
                disabled={saving} onClick={handleSaveFee}
                className="bg-brandRed text-white p-4 rounded-xl hover:bg-white hover:text-black transition-colors shrink-0"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Trophy className="text-brandRed" size={24} /> Registered Squads ({teams.length})
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                placeholder="Search Teams or Reps..." 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brandRed transition-colors"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-[30px] overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white/5 text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-black border-b border-white/10">
                  <th className="p-6">Squad Name</th>
                  <th className="p-6">Representative</th>
                  <th className="p-6">Origin / Type</th>
                  <th className="p-6">Captain details</th>
                  <th className="p-6">Payment Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-bold">
                {filteredTeams.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-zinc-500 italic">No squads registered yet.</td></tr>
                ) : (
                  filteredTeams.map((team, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <span className="text-white text-lg font-black uppercase tracking-tight block">{team.team_name}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest bg-brandRed/10 text-brandRed px-2 py-0.5 rounded-md border border-brandRed/20 mt-1 inline-block">Confirmed</span>
                      </td>
                      <td className="p-6 space-y-1">
                        <span className="text-zinc-200 block">{team.rep_name}</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Phone size={10} /> {team.contact}</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Mail size={10} /> {team.email}</span>
                      </td>
                      <td className="p-6 space-y-1">
                        <span className="text-zinc-300 flex items-center gap-2"><MapPin size={12} className="text-brandRed" /> {team.locality}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{team.team_type}</span>
                      </td>
                      <td className="p-6 space-y-1">
                        <span className="text-zinc-200 block"><span className="text-zinc-500 font-normal">Cap:</span> {team.captain_name}</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Phone size={10} /> {team.captain_contact}</span>
                      </td>
                      <td className="p-6">
                        <span className="font-mono text-xs text-zinc-400 block mb-1">{team.payment_id}</span>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-1"><ShieldCheck size={12} /> Paid ₹{team.amount_paid}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}