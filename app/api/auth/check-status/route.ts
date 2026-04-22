import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Use SERVICE_ROLE to bypass RLS and access the Auth Admin engine
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Securely ask Supabase if this specific user has confirmed their email
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) throw error;

    // If the timestamp exists, they clicked the link!
    if (user && user.email_confirmed_at) {
      return NextResponse.json({ confirmed: true });
    }
    
    return NextResponse.json({ confirmed: false });
    
  } catch (error) {
    return NextResponse.json({ confirmed: false }, { status: 500 });
  }
}