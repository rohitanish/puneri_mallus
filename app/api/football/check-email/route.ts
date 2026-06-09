import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if the email exists in the football_teams table
    const { data, error } = await supabaseAdmin
      .from('football_teams')
      .select('id')
      .eq('email', email.trim().toLowerCase()) // Match exactly, ignoring case/spaces
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If data exists, return true. Otherwise false.
    return NextResponse.json({ exists: !!data });

  } catch (e: any) {
    console.error("Check Email Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}