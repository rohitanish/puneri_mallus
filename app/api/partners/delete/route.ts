import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * DELETE ROUTE: TRIBE ALLIES
 * Removes a partner from the MongoDB collection.
 * Usage: /api/partners/delete?id=65d2f...
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing Partner ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("puneri_mallus");

    // Perform the deletion
    const result = await db.collection("partners").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ally Removed Successfully" });
  } catch (e: any) {
    console.error("API DELETE ERROR:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}