import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS for guest checkouts
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bid = searchParams.get('bid');

    if (!bid) return NextResponse.json({ error: "Booking ID missing" }, { status: 400 });

    // 1. Fetch booking from Supabase
    const { data: booking, error } = await supabaseAdmin
      .from('ticket_bookings')
      .select('*')
      .eq('id', bid)
      .single();

    if (error || !booking) throw new Error("Booking not found");

    // 2. Fetch associated Event from MongoDB for the poster/location
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const event = await db.collection("events").findOne({ _id: new ObjectId(booking.event_id) });

    return NextResponse.json({ booking, event });

  } catch (error: any) {
    console.error("Booking Fetch Error:", error);
    return NextResponse.json({ error: "Failed to retrieve booking" }, { status: 500 });
  }
}