import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * DELETE ROUTE: TRIBE ALLIES
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing Partner ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("punerimallus"); // Updated DB Name

    // 1. Find the partner to get the logo/image URL before deleting
    const partner = await db.collection("partners").findOne({ _id: new ObjectId(id) });

    if (partner?.logoUrl || partner?.image) {
      const imageUrl = partner.logoUrl || partner.image;
      const fileName = imageUrl.split('/').pop();
      
      if (fileName) {
        // 2. Remove the file from the 'partners' bucket in Supabase
        await supabase.storage.from('partners').remove([`${fileName}`]);
      }
    }

    // 3. Perform the deletion in MongoDB
    const result = await db.collection("partners").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ally Removed Successfully" });
  } catch (e: any) {
    console.error("API DELETE ERROR:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}