import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Fetch the settings row
    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const formattedSettings = settings ? {
      martEnabled: settings.mart_enabled,
      martNote: settings.mart_note,
      martMonthlyActive: settings.mart_monthly_active,
      martMonthlyPrice: settings.mart_monthly_price,
      martYearlyActive: settings.mart_yearly_active,
      martYearlyPrice: settings.mart_yearly_price,
      martLifetimeActive: settings.mart_lifetime_active,
      martLifetimePrice: settings.mart_lifetime_price,
      membershipPrice: settings.membership_price,
      membershipBenefits: settings.membership_benefits,
      currency: settings.currency,
    } : null;

    return NextResponse.json(formattedSettings || { 
      martEnabled: false, 
      martMonthlyPrice: 99,
      martYearlyPrice: 899,
      martLifetimePrice: 2499,
      membershipPrice: 499
    });
  } catch (e) {
    console.error("Supabase Settings Fetch Error:", e);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // 1. Authenticate the User making the request
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Initialize Service Role Client for DB checks/writes
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // 3. 🔥 DYNAMIC ADMIN CHECK: Query the authorized_admins table
    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from('authorized_admins')
      .select('email')
      .eq('email', user.email)
      .single();

    // If there's an error finding the record, or it doesn't exist, block the request
    if (adminError || !adminRecord) {
      console.warn(`SECURITY ALERT: Unauthorized settings update attempt by ${user.email}`);
      return NextResponse.json({ error: "Forbidden: Master Admin Access Required" }, { status: 403 });
    }

    // --- USER IS AN AUTHORIZED ADMIN, PROCEED WITH UPDATE ---

    const body = await req.json();

    const dbPayload = {
      id: 1, 
      mart_enabled: body.martEnabled,
      mart_note: body.martNote,
      mart_monthly_active: body.martMonthlyActive,
      mart_monthly_price: body.martMonthlyPrice,
      mart_yearly_active: body.martYearlyActive,
      mart_yearly_price: body.martYearlyPrice,
      mart_lifetime_active: body.martLifetimeActive,
      mart_lifetime_price: body.martLifetimePrice,
      membership_price: body.membershipPrice,
      membership_benefits: body.membershipBenefits,
      currency: body.currency || 'INR',
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await supabaseAdmin
      .from('app_settings')
      .upsert(dbPayload);

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Supabase Settings Update Error:", e.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}