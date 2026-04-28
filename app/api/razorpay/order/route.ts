import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { paymentType, plan } = await req.json();

    // 1. Initialize Supabase Admin to fetch dynamic pricing settings securely
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // 🔥 FIX 1: Fetch the settings row safely without hardcoding id=1
    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error("Failed to fetch settings from DB. Falling back to default pricing.", error.message);
    }

    // 🔥 FIX 2: Check for both camelCase and snake_case column names
    let targetPrice = 99; // Absolute fallback
    
    if (paymentType === "LIFETIME") {
      targetPrice = settings?.membershipPrice || settings?.membership_price || 999;
    } 
    else if (paymentType === "MART") {
      if (plan === "MONTHLY") targetPrice = settings?.martMonthlyPrice || settings?.mart_monthly_price || 99;
      else if (plan === "YEARLY") targetPrice = settings?.martYearlyPrice || settings?.mart_yearly_price || 899;
      else if (plan === "LIFETIME") targetPrice = settings?.martLifetimePrice || settings?.mart_lifetime_price || 2499;
    }

    // 3. Convert to Paise (Required by Razorpay, Integer only)
    const amountInPaise = Math.round(Number(targetPrice) * 100);

    if (amountInPaise < 100) {
      return NextResponse.json({ error: "Amount too low (Min ₹1)" }, { status: 400 });
    }

    // 4. Build the Razorpay Order Options
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${paymentType}_${Date.now()}`,
      notes: {
        paymentType: paymentType, 
        plan: plan || "NONE" 
      }
    };

    // 5. Generate Order Token
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
    
  } catch (error: any) {
    console.error("RAZORPAY_ORDER_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" }, 
      { status: 500 }
    );
  }
}