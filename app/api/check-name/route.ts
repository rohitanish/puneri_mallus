import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const excludeId = searchParams.get('excludeId'); // Ignores current card if editing

    if (!name || name.trim() === '') {
        return NextResponse.json({ exists: false });
    }

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // Case-insensitive exact match regex
    const regex = new RegExp(`^${name.trim()}$`, 'i');
    const query: any = {};
    
    if (excludeId && ObjectId.isValid(excludeId)) {
        query._id = { $ne: new ObjectId(excludeId) };
    }

    // 1. Check Community Circles (field is 'title')
    const communityMatch = await db.collection("community_circles").findOne({ ...query, title: regex });
    if (communityMatch) return NextResponse.json({ exists: true, source: 'Community Circle' });

    // 2. Check Mallu Mart (field is 'name')
    const martMatch = await db.collection("mallu_mart").findOne({ ...query, name: regex });
    if (martMatch) return NextResponse.json({ exists: true, source: 'Mallu Mart' });

    return NextResponse.json({ exists: false });
  } catch (e) {
    console.error("NAME_CHECK_ERROR:", e);
    return NextResponse.json({ error: "Failed to verify name" }, { status: 500 });
  }
}