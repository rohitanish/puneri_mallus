import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from "@/lib/mongodb";
import { sendMartSubscriptionEmail, sendPremiumMembershipEmail } from "@/lib/mail";
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. INITIALIZE SECURE SUPABASE CLIENT
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    // 2. GET THE TRUE IDENTITY OF THE USER
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid Session" }, { status: 401 });
    }

    // 3. Extract Payment Details from Frontend (IGNORE userId and userEmail here)
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentType, 
      plan 
    } = await req.json();

    // 4. OVERRIDE frontend data with cryptographic truth
    const trueUserId = user.id;
    const trueUserEmail = user.email;

    // 5. Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");
    
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid signature", success: false }, { status: 400 });
    }

    // --- IF WE REACH HERE, THE PAYMENT IS 100% AUTHENTIC ---

    // 6. LOG TO SUPABASE FOR ADMIN PORTAL (Service Role overrides RLS securely)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    await supabaseAdmin.from('payments').insert({
      supabase_id: trueUserId,
      user_email: trueUserEmail,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      type: paymentType,
      plan: plan,
      status: 'SUCCESS'
    });

    // 7. LOG TO MONGODB FOR ADMIN PORTAL
    const client = await clientPromise;
    const db = client.db("punerimallus");

    await db.collection("payments").insertOne({
      supabase_id: trueUserId,
      user_email: trueUserEmail,
      razorpay_order_id,
      razorpay_payment_id,
      type: paymentType,
      plan: plan,
      status: "SUCCESS",
      createdAt: new Date()
    });

    // 8. DYNAMIC UPDATE LOGIC: Determine Expiration & Profile Data
    let updateData: any = {};
    const now = new Date();

    if (paymentType === "LIFETIME") {
      // Global Inner Circle Premium Member
      updateData = { 
        $set: { 
          isPremiumMember: true, 
          martUnlocked: true,
          lastPaymentId: razorpay_payment_id,
          updatedAt: now
        } 
      };
    } 
    else if (paymentType === "MART") {
      // Subscription calculations
      if (plan === "MONTHLY") {
        updateData = { 
          $set: { 
            martUnlocked: true, 
            martPlan: "MONTHLY",
            martExpiresAt: new Date(now.setMonth(now.getMonth() + 1)),
            lastPaymentId: razorpay_payment_id,
            updatedAt: new Date() 
          } 
        };
      } else if (plan === "YEARLY") {
        updateData = { 
          $set: { 
            martUnlocked: true, 
            martPlan: "YEARLY",
            martExpiresAt: new Date(now.setFullYear(now.getFullYear() + 1)),
            lastPaymentId: razorpay_payment_id,
            updatedAt: new Date()
          } 
        };
      } else if (plan === "LIFETIME") {
        updateData = { 
          $set: { 
            martUnlocked: true, 
            martPlan: "LIFETIME",
            lastPaymentId: razorpay_payment_id,
            updatedAt: now
          },
          $unset: { martExpiresAt: "" } // If they upgrade to lifetime, remove expiration
        };
      }
    }

    // 9. SECURE PROFILE UPDATE (Using trueUserId)
    const updateResult = await db.collection("profiles").updateOne(
      { supabase_id: trueUserId }, 
      updateData,
      { upsert: true }
    );

    if (updateResult.matchedCount === 0) {
      console.warn(`Payment verified but no profile found for ${trueUserId}. Upserted new document.`);
    }

    // 10. SEND NOTIFICATION EMAILS (Using trueUserEmail)
    if (trueUserEmail) {
      if (paymentType === "LIFETIME") {
        await sendPremiumMembershipEmail(trueUserEmail, razorpay_order_id, razorpay_payment_id);
      } else if (paymentType === "MART") {
        await sendMartSubscriptionEmail(trueUserEmail, plan, razorpay_order_id, razorpay_payment_id);
      }
    }

    return NextResponse.json({ 
      message: "Payment verified securely, profile updated, and email sent.", 
      success: true 
    });

  } catch (error: any) {
    console.error("VERIFICATION_CRITICAL_ERROR:", error);
    return NextResponse.json({ error: "Verification failed internally" }, { status: 500 });
  }
}