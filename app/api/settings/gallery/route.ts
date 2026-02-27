import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 1. THE MISSING GET ROUTE ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Look for the archive_gallery settings
    const settings = await db.collection("site_settings").findOne({ type: "archive_gallery" });
    
    // Return empty array if document doesn't exist yet
    return NextResponse.json({ 
      images: settings?.images || [] 
    });
  } catch (error: any) {
    console.error("Gallery Fetch Error:", error);
    return NextResponse.json({ images: [], error: error.message }, { status: 500 });
  }
}

// --- 2. THE POST ROUTE (With Cleanup) ---
export async function POST(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // Fetch current gallery to identify orphans for deletion
    const oldSettings = await db.collection("site_settings").findOne({ type: "archive_gallery" });
    const oldImages = oldSettings?.images || [];

    const newImageUrls = new Set(images);
    const orphans = oldImages.filter((oldUrl: string) => !newImageUrls.has(oldUrl));

    if (orphans.length > 0) {
      const filesToRemove = orphans.map((url: string) => {
        const fileName = url.split('/').pop();
        // Specific path for your about-gallery folder
        return `about-gallery/${fileName}`; 
      });

      await supabase.storage.from('assets').remove(filesToRemove);
    }

    // Update MongoDB
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
  } catch (error: any) {
    console.error("Gallery Post Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}