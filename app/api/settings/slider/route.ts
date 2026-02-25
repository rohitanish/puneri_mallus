import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET: Fetch the slider settings for the Home page
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Find the single document for the slider
    const settings = await db.collection("site_settings").findOne({ type: "slider" });
    
    // Return empty slides array if document doesn't exist yet
    return NextResponse.json(settings || { slides: [] });
  } catch (error) {
    console.error("Slider Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch slider settings" }, { status: 500 });
  }
}

// POST: Save or Update slider settings from the Admin panel
export async function POST(request: Request) {
  try {
    const { slides } = await request.json();
    const client = await clientPromise;
    const db = client.db("punerimallus");

    // We use updateOne with { upsert: true }
    // This finds the document with type: "slider" and updates it, 
    // or creates it if it's missing.
    await db.collection("site_settings").updateOne(
      { type: "slider" },
      { 
        $set: { 
          slides, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Slider synced to cloud" });
  } catch (error) {
    console.error("Slider Save Error:", error);
    return NextResponse.json({ error: "Failed to save slider settings" }, { status: 500 });
  }
}