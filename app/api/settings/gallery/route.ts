import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Attempt to find the archive_gallery document
    const settings = await db.collection("site_settings").findOne({ type: "archive_gallery" });
    
    // If nothing is found, return an empty array instead of null
    return NextResponse.json({ 
      images: settings?.images || [] 
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // upsert: true creates the document if it doesn't exist
    await db.collection("site_settings").updateOne(
      { type: "archive_gallery" },
      { 
        $set: { 
          images: images, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}