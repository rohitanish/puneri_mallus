import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // 1. Fetch the circle to get the image URL before deleting
    const circle = await db.collection("community_circles").findOne({ _id: new ObjectId(id) });

    if (circle?.image) {
      const fileName = circle.image.split('/').pop();
      if (fileName) {
        // 2. Remove the asset from Supabase storage
        await supabase.storage.from('community').remove([`thumbnails/${fileName}`]);
      }
    }

    // 3. Delete the document from MongoDB
    await db.collection("community_circles").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (e) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}