import React from "react";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. AWAIT the cookies promise
  const cookieStore = await cookies();

  // 2. Initialize Supabase Server Client correctly
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Use the awaited cookieStore
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 3. Check for active session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/admin');
  }

  // 4. Verify email using a Case-Insensitive, trimmed check
const { data: adminEntry, error } = await supabase
  .from('authorized_admins')
  .select('email')
  // Use .ilike for case-insensitive matching and .trim() for accidental spaces
  .ilike('email', user.email?.trim() || '') 
  .maybeSingle(); 


console.log("ADMIN DEBUG:", { sessionEmail: user.email, dbMatch: adminEntry, dbError: error });

if (!adminEntry) {
  redirect('/'); 
}

  return (
    <section className="admin-wrapper bg-black min-h-screen">
      <div className="fixed top-6 right-6 z-[100] hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-full shadow-2xl">
        <div className="w-1.5 h-1.5 rounded-full bg-brandRed animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
          Admin Hub // <span className="text-white">{user.email}</span>
        </span>
      </div>

      {children}
    </section>
  );
}