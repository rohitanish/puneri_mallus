"use client";

import { ShieldCheck, Activity, User, Clock, UserMinus, Loader2, AlertTriangle, Crown, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { revokeAdminAccess } from '@/app/admin/action';
import { useAlert } from '@/context/AlertContext'; 
import TribeConfirm from '@/components/TribeConfirm'; // Ensure this component is created

interface AuditLog {
  target_email: string;
  created_at: string;
  action_type?: string; 
}

interface Admin {
  email: string;
  created_at: string;
  admin_audit_logs: AuditLog[];
}

const FOUNDER_EMAILS = ['vishnu@gmail.com', 'rohitanish86@gmail.com'];

export default function MemberActivityList({ admins }: { admins: Admin[] }) {
  const router = useRouter();
  const { showAlert } = useAlert();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  
  // States for the Dialog Box
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => 
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [admins, searchQuery]);

  // Step 1: Open the Dialog
  const initiateRevoke = (email: string) => {
    if (FOUNDER_EMAILS.includes(email)) {
      showAlert("Root operators cannot be revoked via this terminal.", "error");
      return;
    }
    setTargetEmail(email);
    setConfirmOpen(true);
  };

  // Step 2: Execute after Dialog Confirmation
  const handleRevokeExecute = async () => {
    setConfirmOpen(false);
    setIsRevoking(targetEmail);
    
    try {
      const result = await revokeAdminAccess(targetEmail);
      if (result?.error) {
        showAlert(result.error, "error");
      } else {
        showAlert("Operator Access Revoked Successfully", "success");
        router.refresh(); 
      }
    } catch (err) {
      showAlert("System Encryption Error", "error");
    } finally {
      setIsRevoking(null);
      setTargetEmail("");
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* TRIBE DIALOG BOX */}
      <TribeConfirm 
        isOpen={confirmOpen}
        title="Revoke Access"
        message={`CRITICAL: You are about to disconnect ${targetEmail} from the admin node. This action will be logged in the audit trail.`}
        onConfirm={handleRevokeExecute}
        onCancel={() => setConfirmOpen(false)}
        loading={!!isRevoking}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">Active Operators // Audit Trail</h2>
          <div className="h-[1px] flex-1 bg-zinc-900 hidden md:block" />
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brandRed transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Search Operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-950 border border-white/5 rounded-full py-2.5 pl-11 pr-10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-brandRed/40 focus:ring-1 focus:ring-brandRed/20 transition-all w-full md:w-64"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAdmins.map((admin) => {
          const isFounder = FOUNDER_EMAILS.includes(admin.email);
          
          return (
            <div key={admin.email} className="bg-zinc-950 border border-white/5 p-8 rounded-[40px] hover:border-brandRed/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brandRed/5 blur-[60px] rounded-full group-hover:bg-brandRed/10 transition-colors" />

              {!isFounder && (
                <button
                  onClick={() => initiateRevoke(admin.email)}
                  disabled={isRevoking === admin.email}
                  className="absolute top-8 right-8 p-3 rounded-xl bg-black border border-white/5 text-zinc-600 hover:text-brandRed hover:border-brandRed/40 transition-all z-20 group/btn"
                >
                  {isRevoking === admin.email ? (
                    <Loader2 size={16} className="animate-spin text-brandRed" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Revoke</span>
                      <UserMinus size={16} />
                    </div>
                  )}
                </button>
              )}

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-4 bg-black border border-white/5 rounded-[24px] group-hover:border-brandRed/40 transition-all shadow-2xl">
                  {isFounder ? <Crown size={24} className="text-amber-500" /> : <ShieldCheck size={24} className="text-brandRed" />}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white truncate max-w-[150px] tracking-tight">{admin.email}</h4>
                    {isFounder && <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Founder</span>}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Clock size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest" suppressHydrationWarning>Node Linked {new Date(admin.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} className="text-brandRed" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Recent System Actions</p>
                </div>

                {admin.admin_audit_logs && admin.admin_audit_logs.length > 0 ? (
                  admin.admin_audit_logs.slice(0, 3).map((log, i) => {
                    const activityMap: Record<string, { label: string; color: string }> = {
                      'AUTH_GRANT':      { label: 'Authorized:',     color: 'text-zinc-500' },
                      'AUTH_REVOKE':     { label: 'Revoked Access:', color: 'text-brandRed' },
                      'EVENT_UPDATE':    { label: 'Event Mod:',      color: 'text-blue-400' },
                      'GALLERY_UPDATE':  { label: 'Gallery Edit:',   color: 'text-purple-400' },
                      'SOCIAL_UPDATE':   { label: 'Pulse Sync:',     color: 'text-amber-500' },
                      'SLIDER_UPDATE':   { label: 'Slider Edit:',    color: 'text-emerald-400' },
                      'PARTNER_UPDATE':  { label: 'Ally Mod:',       color: 'text-brandRed' },
                      'COMMUNITY_UPDATE':{ label: 'Tribe Mod:',      color: 'text-cyan-400' },
                    };

                    const config = activityMap[log.action_type || ''] || { label: 'System:', color: 'text-zinc-400' };

                    return (
                      <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl hover:bg-black transition-colors">
                        <p className={`text-[10px] font-bold uppercase leading-tight ${config.color}`}>
                          {config.label} <span className="text-white ml-2">{log.target_email}</span>
                        </p>
                        <p className="text-[7px] text-zinc-600 font-black mt-2 uppercase tracking-tighter" suppressHydrationWarning>
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 border border-dashed border-white/5 rounded-2xl text-center">
                    <p className="text-[9px] text-zinc-800 italic font-bold uppercase tracking-widest">No Activity Recorded</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}