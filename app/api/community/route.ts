import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // Case 1: Fetch a specific Organization/Circle by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }

      const circle = await db.collection("community_circles").findOne({ 
        _id: new ObjectId(id) 
      });

      if (!circle) {
        return NextResponse.json({ error: "Node not found" }, { status: 404 });
      }

      return NextResponse.json(circle);
    }

    // Case 2: Fetch All (Original Logic)
    // We sort by isVerified so Samajams/Official Orgs stay at the top of the 'All' list
    const circles = await db.collection("community_circles")
      .find({})
      .sort({ isVerified: -1, title: 1 }) 
      .toArray();
      
    return NextResponse.json(circles);
  } catch (e: any) {
    console.error("COMMUNITY_API_ERROR:", e);
    return NextResponse.json({ error: "Failed to sync with grid" }, { status: 500 });
  }
}