import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { sendBusinessVerificationEmail } from '@/lib/mail';
// 🔥 ADD THIS LINE TO DISABLE CACHING
export const dynamic = 'force-dynamic';
// Use Service Role to bypass RLS for token checking
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. GET: THIS RUNS WHEN THE USER CLICKS THE LINK IN THEIR EMAIL
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) return new NextResponse("Missing token", { status: 400 });

  // Find the record and mark it verified
  const { error } = await supabaseAdmin
    .from('directory_owners')
    .update({ is_verified: true, verification_token: null }) // Clear token after use
    .eq('verification_token', token);

  if (error) return new NextResponse("Invalid or expired link", { status: 400 });

  // Return a nice success screen they see in their new tab
  return new NextResponse(`
    <html>
      <body style="background: black; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center;">
          <h1 style="color: #ef4444; font-style: italic; text-transform: uppercase;">Identity Verified!</h1>
          <p style="color: #a1a1aa;">You can close this tab and return to your original screen.</p>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}

// 2. POST: THIS RUNS WHEN THE FRONTEND REQUESTS A LINK
export async function POST(req: Request) {
  try {
    const { userId, fullName, phone, businessName, email, source } = await req.json();
    
    // Generate a secure random string
    const token = crypto.randomBytes(32).toString('hex');

    // Upsert the UNVERIFIED record into the database
    await supabaseAdmin.from('directory_owners').upsert({
      user_id: userId,
      full_name: fullName,
      phone_number: phone,
      business_name: businessName,
      verified_email: email,
      source: source,
      is_verified: false,
      verification_token: token
    }, { onConflict: 'user_id, source' });

    // Generate the click link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyLink = `${baseUrl}/api/business/verify?token=${token}`;

    // 🔥 THE FIX: Actually trigger the email sender function here!
    await sendBusinessVerificationEmail(email, verifyLink, businessName);
    
    // Keeping this log so you can easily test locally without checking your inbox
    console.log("TESTING LINK (Click this in your terminal):", verifyLink);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}