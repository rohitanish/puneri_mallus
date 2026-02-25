import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function checkAdminAccess() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Use getAll to see all cookies
        getAll() {
          return cookieStore.getAll();
        },
        // IMPORTANT: Use setAll to allow the token to refresh
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This error is fine to ignore in Server Components
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, user: null };

  // Use .ilike for a safer, case-insensitive match
  const { data: adminEntry } = await supabase
    .from('authorized_admins')
    .select('email')
    .ilike('email', user.email || '') 
    .maybeSingle(); 

  return {
    isAdmin: !!adminEntry,
    user
  };
}