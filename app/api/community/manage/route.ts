import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const data = await req.json();
    const { _id, ...body } = data;

    if (_id) {
      // 1. Fetch the existing document to compare images
      const oldCircle = await db.collection("community_circles").findOne({ _id: new ObjectId(_id) });

      // 2. If the image has changed, delete the old one from Supabase
      if (oldCircle?.image && oldCircle.image !== body.image) {
        const fileName = oldCircle.image.split('/').pop();
        if (fileName) {
          await supabase.storage.from('community').remove([`thumbnails/${fileName}`]);
        }
      }

      // 3. Perform the update
      await db.collection("community_circles").updateOne(
        { _id: new ObjectId(_id) },
        { $set: body }
      );
      return NextResponse.json({ message: "Updated" });
    } else {
      // CREATE
      const result = await db.collection("community_circles").insertOne(body);
      return NextResponse.json(result);
    }
  } catch (e) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}