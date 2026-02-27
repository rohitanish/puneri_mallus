import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Fetch and sort by name (1 for ascending, -1 for descending)
    const partners = await db.collection("partners")
      .find({})
      .sort({ name: 1 }) 
      .toArray();

    return NextResponse.json(partners || []);
  } catch (e: any) {
    console.error("PARTNERS_GET_ERROR:", e);
    return NextResponse.json({ error: "Failed to fetch tribe allies" }, { status: 500 });
  }
}