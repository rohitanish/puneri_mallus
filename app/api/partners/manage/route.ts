import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("puneri_mallus");
    const data = await req.json();

    // 1. Separate ID from the rest of the payload
    const { _id, ...body } = data;

    // 2. Data Sanitization (Optional but recommended)
    // We ensure that even if the frontend sends extra fields, 
    // we only keep what we need, and clean the WhatsApp string.
    const sanitizedPartner = {
      name: body.name,
      category: body.category,
      description: body.description,
      perk: body.perk,
      link: body.link,
      image: body.image,
      email: body.email?.toLowerCase().trim(),
      instagram: body.instagram?.replace('@', '').trim(),
      whatsapp: body.whatsapp?.replace(/\D/g, ''), // Store only digits
      updated_at: new Date()
    };

    if (_id) {
      // UPDATE EXISTING ALLY
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