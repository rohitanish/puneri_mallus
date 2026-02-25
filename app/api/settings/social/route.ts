import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const settings = await db.collection("site_settings").findOne({ type: "social_glimpse" });
    return NextResponse.json(settings?.posts || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Expecting an array of 3 objects
    const client = await clientPromise;
    const db = client.db("punerimallus");

    await db.collection("site_settings").updateOne(
      { type: "social_glimpse" },
      { $set: { posts: body, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}