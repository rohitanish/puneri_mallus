import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { paymentType, plan, cart, eventId, pointsToRedeem = 0 } = await req.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error("Failed to fetch settings from DB. Falling back to default pricing.", error.message);
    }

    let targetPrice = 99; 
    
    if (paymentType === "LIFETIME") {
      targetPrice = settings?.membershipPrice || settings?.membership_price || 999;
    } 
    else if (paymentType === "MART") {
      if (plan === "MONTHLY") targetPrice = settings?.martMonthlyPrice || settings?.mart_monthly_price || 99;
      else if (plan === "YEARLY") targetPrice = settings?.martYearlyPrice || settings?.mart_yearly_price || 899;
      else if (plan === "LIFETIME") targetPrice = settings?.martLifetimePrice || settings?.mart_lifetime_price || 2499;
    }
    else if (paymentType === "FOOTBALL") {
      targetPrice = settings?.footballFee || settings?.football_fee || 1500;
    }
    // 🔥 SECURE EVENT TICKETING LOGIC
    else if (paymentType === "EVENT_TICKET") {
      if (!cart || !eventId) return NextResponse.json({ error: "Missing ticket data" }, { status: 400 });
      
      const { data: categories } = await supabaseAdmin
        .from('event_ticket_categories')
        .select('*')
        .eq('event_id', eventId);

      if (!categories) return NextResponse.json({ error: "Categories not found" }, { status: 404 });

      let backendCalculatedTotal = 0;
      let currentCartQuantity = 0; // 🔥 Track incoming quantity
      
      for (const [catId, qty] of Object.entries(cart)) {
        const cat = categories.find(c => c.id === catId);
        if (!cat) throw new Error("Invalid category selected");
        
        if (cat.sold + (qty as number) > cat.capacity) {
          throw new Error(`Oops! "${cat.name}" is sold out. Someone just bought the last ones.`);
        }
        backendCalculatedTotal += cat.price * (qty as number);
        currentCartQuantity += (qty as number);
      }

      // 🔥 CONSOLIDATED VERIFICATION & IDENTITY LOGIC
      const cookieStore = await cookies();
      const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
      );

      const { data: { user } } = await supabaseAuth.auth.getUser();

      if (user) {
        // ==========================================
        // 🔥 GLOBAL CAP ENFORCEMENT (Max 7 per ROOT user)
        // ==========================================
        const { data: existingBookings } = await supabaseAdmin
          .from('ticket_bookings')
          .select('tickets_data')
          .eq('event_id', eventId)
          .eq('user_id', user.id); // Query by root identity, NOT email

        let previouslyBought = 0;
        if (existingBookings) {
          existingBookings.forEach(b => {
            previouslyBought += (b.tickets_data?.length || 0);
          });
        }

        if (previouslyBought + currentCartQuantity > 7) {
          throw new Error(`Limit Exceeded: Your main account has already secured ${previouslyBought} passes. You can only buy a maximum of 7 tickets total across all emails.`);
        }

        // ==========================================
        // Profile Discounts & Loyalty Logic
        // ==========================================
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('is_member, loyalty_points')
          .eq('id', user.id)
          .single();

        // STEP 1: Apply Tribe Member Percentage Discount FIRST
        if (profile?.is_member) {
          const client = await clientPromise;
          const db = client.db("punerimallus");
          const eventData = await db.collection("events").findOne({ _id: new ObjectId(eventId) });

          const discountPercent = eventData?.memberDiscount || 0;
          if (discountPercent > 0) {
            const discountAmount = (backendCalculatedTotal * discountPercent) / 100;
            backendCalculatedTotal -= discountAmount;
          }
        }

        // STEP 2: Apply Loyalty Points Flat Deduction SECOND
        if (pointsToRedeem > 0) {
          const MIN_REDEEM_THRESHOLD = 50;
          if (pointsToRedeem < MIN_REDEEM_THRESHOLD) {
            throw new Error(`A minimum of ${MIN_REDEEM_THRESHOLD} points is required to unlock redemption.`);
          }

          if (profile && profile.loyalty_points >= pointsToRedeem) {
            const verifiedDiscount = Math.min(pointsToRedeem, backendCalculatedTotal);
            backendCalculatedTotal -= verifiedDiscount;
          } else {
            throw new Error("Insufficient loyalty balance for redemption.");
          }
        }
      } else if (pointsToRedeem > 0) {
         throw new Error("Unauthorized redemption attempt.");
      }

      if (backendCalculatedTotal <= 0) throw new Error("Invalid amount");

      targetPrice = backendCalculatedTotal; 
    }

    const RAZORPAY_FEE_PERCENTAGE = 0.0236;
    const finalAmountWithTaxes = targetPrice / (1 - RAZORPAY_FEE_PERCENTAGE);
    const amountInPaise = Math.round(finalAmountWithTaxes * 100);

    if (amountInPaise < 100) {
      return NextResponse.json({ error: "Amount too low (Min ₹1)" }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${paymentType}_${Date.now()}`,
      notes: { paymentType: paymentType, plan: plan || "NONE" }
    };

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