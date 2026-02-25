import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const data = await request.json();

    const { _id, ...eventData } = data;

    // SANITIZATION LOGIC
    const sanitizedEvent = {
      ...eventData,
      // Force category and title to uppercase for UI consistency
      category: eventData.category?.trim().toUpperCase() || 'GENERAL',
      title: eventData.title?.trim().toUpperCase(),
      location: eventData.location?.trim().toUpperCase(),
      updated_at: new Date()
    };

    if (_id) {
      // UPDATE EXISTING
      await db.collection("events").updateOne(
        { _id: new ObjectId(_id) },
        { $set: sanitizedEvent }
      );
      return NextResponse.json({ success: true, message: "Event Intelligence Updated" });
    } else {
      // CREATE NEW
      const result = await db.collection("events").insertOne({
        ...sanitizedEvent,
        created_at: new Date()
      });
      return NextResponse.json({ success: true, id: result.insertedId, message: "Event Published to Tribe" });
    }
  } catch (error: any) {
    console.error("EVENT_MANAGE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}