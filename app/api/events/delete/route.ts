import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("punerimallus");

    // 1. Find the event to get the image URL before it's gone
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) });

    if (event?.image) {
      // Extract the filename from the URL
      const fileName = event.image.split('/').pop();
      if (fileName) {
        // 2. Delete the physical file from the 'events' bucket
        // Ensure the path 'posters/' matches your Supabase folder structure
        await supabase.storage.from('events').remove([`posters/${fileName}`]);
      }
    }

    // 3. Delete the document from MongoDB
    await db.collection("events").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}