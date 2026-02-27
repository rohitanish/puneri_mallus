import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const circles = await db.collection("community_circles").find({}).toArray();
    return NextResponse.json(circles);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}