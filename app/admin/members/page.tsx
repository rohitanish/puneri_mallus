import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import MemberActivityList from '@/components/admin/MemberActivityList';
import AddAdminCard from '@/components/admin/AddAdminCard';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function MembersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  );

  // 1. Fetch data including 'action_type' for the activity history
  const { data: admins, error } = await supabase
    .from('authorized_admins')
    .select(`
      email,
      created_at,
      admin_audit_logs (
        target_email,
        created_at,
        action_type
      )
    `)
    .order('created_at', { ascending: false })
  // 2. IMPORTANT: Order the NESTED logs by their creation date
  .order('created_at', { referencedTable: 'admin_audit_logs', ascending: false });
  // Debugging log for your terminal
  console.log("MEMBERS_FETCH_DEBUG:", { 
    count: admins?.length, 
    firstLogType: admins?.[0]?.admin_audit_logs?.[0]?.action_type,
    error 
  });

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6 selection:bg-brandRed/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-6 mb-12">
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-brandRed" size={32} />
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
              Tribe <span className="text-brandRed">Records.</span>
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-brandRed/10 border border-brandRed/20 rounded-[32px] flex items-center gap-4">
            <AlertCircle className="text-brandRed" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-brandRed">
              System Error: {error.message}
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">
            {(!admins || admins.length === 0) && !error ? (
               <div className="p-20 border border-dashed border-white/5 rounded-[40px] text-center">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-loose">
                    Zero Records Found <br/>
                    <span className="text-white italic">Manually add your first admin via Supabase Dashboard</span>
                  </p>
               </div>
            ) : (
              <MemberActivityList admins={admins || []} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <AddAdminCard />
          </div>
        </div>
      </div>
    </div>
  );
}