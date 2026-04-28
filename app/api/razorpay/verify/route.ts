import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendPremiumMembershipEmail, sendMartSubscriptionEmail } from "@/lib/mail"; 
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. INITIALIZE SECURE SUPABASE CLIENT (To verify who sent the request)
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    // 2. GET THE TRUE IDENTITY OF THE USER
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid Session" }, { status: 401 });
    }

    // 3. EXTRACT PAYMENT DETAILS
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentType, 
      plan,
      amount // 🔥 EXTRACT THE AMOUNT HERE
    } = await req.json();

    const trueUserId = user.id;

    // 4. VERIFY RAZORPAY CRYPTOGRAPHIC SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");
    
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid signature", success: false }, { status: 400 });
    }

    // --- PAYMENT IS AUTHENTIC: BEGIN SECURE DATABASE OPERATIONS ---

    // 5. INITIALIZE SUPABASE SERVICE ROLE (Bypasses RLS for secure admin writes)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Fetch the user's latest data from Profiles to ensure we have the newly captured email/phone
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email, phone_number, full_name')
      .eq('id', trueUserId)
      .single();

    const trueUserEmail = profile?.email || user.email;
    const trueUserPhone = profile?.phone_number || '';

    // 6. RECORD THE TRANSACTION IN THE PAYMENTS TABLE
    await supabaseAdmin.from('payments').insert({
      user_id: trueUserId,
      email: trueUserEmail,
      phone_number: trueUserPhone,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      payment_type: paymentType, // 'LIFETIME' or 'MART'
      plan: plan || 'NONE',
      amount: amount || 0, // 🔥 SAVE THE REAL AMOUNT INSTEAD OF 0
      status: 'SUCCESS'
    });

    // 7. DYNAMIC UPDATE LOGIC: Unlock Features Based on Payment Type
    if (paymentType === "LIFETIME") {
      // Step A: Upgrade Base Profile AND Unlock Mart (The Master Key)
      await supabaseAdmin.from('profiles')
        .update({ 
          is_member: true,
          mart_unlocked: true // 🔥 Gives them Mart access automatically
        })
        .eq('id', trueUserId);
        
      // Step B: Activate their pending Membership Record
      await supabaseAdmin.from('memberships')
        .update({ status: 'ACTIVE', payment_id: razorpay_payment_id })
        .eq('user_id', trueUserId);
        
      // Step C: Send Welcome Email
      if (trueUserEmail) {
        await sendPremiumMembershipEmail(trueUserEmail, razorpay_order_id, razorpay_payment_id);
      }
    } 
    else if (paymentType === "MART") {
      // Logic for Mallu Mart Subscription Plans
      const now = new Date();
      let expiresAt = null;
      
      if (plan === "MONTHLY") expiresAt = new Date(now.setMonth(now.getMonth() + 1));
      else if (plan === "YEARLY") expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));

      // Note: You will need a `mart_subscriptions` table in Supabase
      await supabaseAdmin.from('mart_subscriptions').upsert({
        user_id: trueUserId,
        plan: plan,
        status: 'ACTIVE',
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        last_payment_id: razorpay_payment_id
      }, { onConflict: 'user_id' });

      // 🔥 CRITICAL FIX: Sync the flag that the UI actually checks, using the exact DB column name
      await supabaseAdmin.from('profiles')
        .update({ mart_unlocked: true }) 
        .eq('id', trueUserId);

      if (trueUserEmail) {
        await sendMartSubscriptionEmail(trueUserEmail, plan, razorpay_order_id, razorpay_payment_id);
      }
    }

    return NextResponse.json({ 
      message: "Payment verified securely and databases synced.", 
      success: true 
    });

  } catch (error: any) {
    console.error("VERIFICATION_CRITICAL_ERROR:", error);
    return NextResponse.json({ error: "Verification failed internally" }, { status: 500 });
  }
}