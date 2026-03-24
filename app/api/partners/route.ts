import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // Case 1: Fetch a specific Partner by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid Ally ID format" }, { status: 400 });
      }

      const partner = await db.collection("partners").findOne({ 
        _id: new ObjectId(id) 
      });

      if (!partner) {
        return NextResponse.json({ error: "Ally not found in grid" }, { status: 404 });
      }

      return NextResponse.json(partner);
    }

    // Case 2: Fetch All Partners
    // Sort logic: Sorted by Category (organizational tier) then by Name alphabetically
    const partners = await db.collection("partners")
      .find({})
      .sort({ category: 1, name: 1 }) 
      .toArray();

    return NextResponse.json(partners || []);
    
  } catch (e: any) {
    console.error("PARTNERS_GET_ERROR:", e);
    return NextResponse.json({ error: "Failed to sync with Tribe Allies" }, { status: 500 });
  }
}