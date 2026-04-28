// app/api/admin/payments/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Fetch all payments, sorted by newest first
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(payments);
  } catch (error) {
    console.error("ADMIN_PAYMENT_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch ledger" }, { status: 500 });
  }
}