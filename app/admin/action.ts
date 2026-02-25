'use server'

import { checkAdminAccess } from '../../lib/admin'
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// ONLY these emails can manage the admin whitelist (Add or Revoke)
const FOUNDER_EMAILS = ['vishnu@gmail.com', 'rohitanish86@gmail.com']; 

/**
 * Shared helper to initialize Supabase with Server Action cookie handling
 */
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Handled by middleware
          }
        },
      },
    }
  );
}

/**
 * ACTION: ADD ADMIN
 * Restricted to Founders only.
 */
export async function addAdminEmail(formData: FormData) {
  const { isAdmin, user } = await checkAdminAccess();
  
  if (!isAdmin || !user || !user.email) {
    throw new Error("Unauthorized: Invalid Session");
  }

  if (!FOUNDER_EMAILS.includes(user.email)) {
    return { error: "RESTRICTED: Only Founders can authorize new system operators." };
  }

  const targetEmail = formData.get('email')?.toString().toLowerCase().trim();
  if (!targetEmail) return { error: "Email is required" };

  const supabase = await getSupabaseClient();

  const { error: insertError } = await supabase
    .from('authorized_admins')
    .insert([{ email: targetEmail }]);

  if (insertError) {
    if (insertError.code === '23505') return { error: "Email is already authorized." };
    return { error: insertError.message };
  }

  await supabase.from('admin_audit_logs').insert([{
    actor_email: user.email,
    target_email: targetEmail,
    action_type: 'AUTH_GRANT'
  }]);

  revalidatePath('/admin/members'); 
  return { success: true };
}

/**
 * ACTION: REVOKE ADMIN
 * Restricted to Founders only.
 */
export async function revokeAdminAccess(targetEmail: string) {
  const { isAdmin, user } = await checkAdminAccess();
  
  if (!isAdmin || !user || !user.email) {
    throw new Error("Unauthorized: Invalid Session");
  }

  if (!FOUNDER_EMAILS.includes(user.email)) {
    return { error: "ACCESS DENIED: Only Founders can revoke system access." };
  }

  if (targetEmail === user.email) {
    return { error: "SYSTEM PROTECTION: You cannot revoke your own root access." };
  }

  const supabase = await getSupabaseClient();

  const { error: deleteError } = await supabase
    .from('authorized_admins')
    .delete()
    .eq('email', targetEmail);

  if (deleteError) return { error: deleteError.message };

  await supabase.from('admin_audit_logs').insert([{
    actor_email: user.email,
    target_email: targetEmail,
    action_type: 'AUTH_REVOKE'
  }]);

  revalidatePath('/admin/members');
  return { success: true };
}

/**
 * ACTION: UNIVERSAL ACTIVITY LOGGER
 * Call this from Events, Gallery, Slider, Social, Community, or Partners.
 * @param target - The name of the item changed (e.g., "Mallu Beats")
 * @param type - The category of action (e.g., "COMMUNITY_UPDATE")
 */
export async function logAdminActivity(target: string, type: string) {
  const { isAdmin, user } = await checkAdminAccess();
  
  if (!isAdmin || !user || !user.email) {
    return { error: "Unauthorized" };
  }

  const supabase = await getSupabaseClient();

  const { error } = await supabase.from('admin_audit_logs').insert([{
    actor_email: user.email,
    target_email: target,
    action_type: type
  }]);

  if (error) {
    console.error("Failed to log activity:", error.message);
    return { error: error.message };
  }

  // REVALIDATION HUB
  // Ensures all modules refresh their data instantly
  revalidatePath('/admin/members');

  if (type === 'EVENT_UPDATE') revalidatePath('/events');
  if (type === 'SLIDER_UPDATE') revalidatePath('/');
  if (type === 'GALLERY_UPDATE') revalidatePath('/about');
  if (type === 'SOCIAL_UPDATE') revalidatePath('/');
  
  // NEW MODULES
  if (type === 'COMMUNITY_UPDATE') {
    revalidatePath('/community');
    revalidatePath('/admin/community');
  }

  if (type === 'PARTNER_UPDATE') {
    revalidatePath('/partners');
    revalidatePath('/admin/partners');
  }

  return { success: true };
}