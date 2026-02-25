import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ exists: false }, { status: 400 });

    // Initialize Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the SECRET key here
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Fetch users. Note: listUsers returns { data: { users }, error }
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Supabase Admin Error:", error.message);
      throw error;
    }

    // Manual filter to ensure exact match and avoid pagination issues
    const userExists = data.users.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ exists: userExists });

  } catch (error: any) {
    console.error("Detailed API Error:", error);
    // Return more detail to help you debug locally
    return NextResponse.json({ 
      exists: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}