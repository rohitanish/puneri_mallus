import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
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

    const sanitizedPartner = {
      name: body.name,
      category: body.category,
      description: body.description,
      perk: body.perk,
      link: body.link,
      image: body.image,
      email: body.email?.toLowerCase().trim(),
      instagram: body.instagram?.replace('@', '').trim(),
      whatsapp: body.whatsapp?.replace(/\D/g, ''), 
      updated_at: new Date()
    };

    if (_id) {
      // 1. Fetch the existing partner to check for image replacement
      const oldPartner = await db.collection("partners").findOne({ _id: new ObjectId(_id) });

      // 2. If the image has changed, delete the old one from Supabase
      if (oldPartner?.image && oldPartner.image !== sanitizedPartner.image) {
        const fileName = oldPartner.image.split('/').pop();
        if (fileName) {
          // Using 'partners' bucket - ensure this matches your Supabase setup
          await supabase.storage.from('partners').remove([fileName]);
        }
      }

      // 3. UPDATE EXISTING ALLY
      const result = await db.collection("partners").updateOne(
        { _id: new ObjectId(_id) },
        { $set: sanitizedPartner }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Partner not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Ally intelligence updated." });
    } else {
      // CREATE NEW ALLY
      const result = await db.collection("partners").insertOne({
        ...sanitizedPartner,
        created_at: new Date(),
      });

      return NextResponse.json({ 
        message: "New Ally onboarded to the Tribe.", 
        id: result.insertedId 
      });
    }
  } catch (e: any) {
    console.error("PARTNER_MANAGE_ERROR:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}