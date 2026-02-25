import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("puneri_mallus");
    const data = await req.json();
    const { _id, ...body } = data;

    if (_id) {
      // UPDATE
      await db.collection("community_circles").updateOne(
        { _id: new ObjectId(_id) },
        { $set: body }
      );
      return NextResponse.json({ message: "Updated" });
    } else {
      // CREATE
      const result = await db.collection("community_circles").insertOne(body);
      return NextResponse.json(result);
    }
  } catch (e) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}