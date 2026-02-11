import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const data = await request.json();

    const { _id, ...eventData } = data;

    if (_id) {
      // UPDATE EXISTING
      await db.collection("events").updateOne(
        { _id: new ObjectId(_id) },
        { $set: eventData }
      );
      return NextResponse.json({ success: true, message: "Event updated" });
    } else {
      // CREATE NEW
      const result = await db.collection("events").insertOne(eventData);
      return NextResponse.json({ success: true, id: result.insertedId });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}