import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Fetch events sorted by date (soonest first)
    const events = await db.collection("events")
      .find({})
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}