import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role for cleanup
);

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const data = await request.json();

    const { _id, ...eventData } = data;

    const sanitizedEvent = {
      ...eventData,
      category: eventData.category?.trim().toUpperCase() || 'GENERAL',
      title: eventData.title?.trim().toUpperCase(),
      location: eventData.location?.trim().toUpperCase(),
      updated_at: new Date()
    };

    if (_id) {
      const oldEvent = await db.collection("events").findOne({ _id: new ObjectId(_id) });

      if (oldEvent?.image && oldEvent.image !== sanitizedEvent.image) {
        const fileName = oldEvent.image.split('/').pop();
        if (fileName) {
          await supabase.storage.from('events').remove([`posters/${fileName}`]);
        }
      }

      await db.collection("events").updateOne(
        { _id: new ObjectId(_id) },
        { $set: sanitizedEvent }
      );
      return NextResponse.json({ success: true, message: "Event Updated" });
    } else {
      const result = await db.collection("events").insertOne({
        ...sanitizedEvent,
        created_at: new Date()
      });
      return NextResponse.json({ success: true, id: result.insertedId });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * FIXED GET: Checks for events with a date greater than NOW
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Find any event happening today or in the future
    // We check both the isUpcoming toggle AND the date logic for safety
    const now = new Date().toISOString();
    
    const upcoming = await db.collection("events").findOne({
      $or: [
        { isUpcoming: true },
        { date: { $gte: now } }
      ]
    });

    return NextResponse.json({ hasUpcoming: !!upcoming });
  } catch (error) {
    console.error("API_SIGNAL_CHECK_ERROR:", error);
    return NextResponse.json({ hasUpcoming: false }); // Always return an object to prevent Navbar crash
  }
}