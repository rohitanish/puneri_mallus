import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { createClient } from '@supabase/supabase-js';
import { ObjectId } from 'mongodb';

// Admin client to bypass RLS for storage cleanup
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 1. GET: FETCH ALL LISTINGS
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    const items = await db.collection("mallu_mart")
      .find({})
      .sort({ isVerified: -1, isPremium: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

/**
 * 2. POST: CREATE A NEW LISTING
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("punerimallus");

    const result = await db.collection("mallu_mart").insertOne({
      ...data,
      isVerified: false,
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}

/**
 * 3. PATCH: UPDATE EXISTING LISTING (Supports User Edit & Admin Audit)
 */
export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const body = await req.json();
    const { id, userEmail, updatedData, isVerified, isPremium } = body;

    // --- CASE A: ADMIN AUDIT (Toggling Verification/Premium) ---
    // If only 'id' and 'isVerified'/'isPremium' are sent, it's an admin action
    if (id && (isVerified !== undefined || isPremium !== undefined)) {
      const updateFields: any = { updatedAt: new Date() };
      if (isVerified !== undefined) updateFields.isVerified = isVerified;
      if (isPremium !== undefined) updateFields.isPremium = isPremium;

      await db.collection("mallu_mart").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );
      return NextResponse.json({ success: true, message: "Admin audit synced" });
    }

    // --- CASE B: USER EDIT ---
    if (!userEmail || !updatedData) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const existing = await db.collection("mallu_mart").findOne({ 
      _id: new ObjectId(id), 
      userEmail: userEmail 
    });

    if (!existing) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { _id, ...cleanData } = updatedData;

    await db.collection("mallu_mart").updateOne(
      { _id: new ObjectId(id), userEmail: userEmail },
      { 
        $set: { 
          ...cleanData,
          updatedAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * 4. DELETE: REMOVE LISTING & PURGE ALL IMAGES
 */
export async function DELETE(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const { id, userEmail, imagePaths } = await req.json();

    // 1. Verify Ownership (If userEmail is provided, check ownership. If not, assume Admin action)
    const query: any = { _id: new ObjectId(id) };
    if (userEmail) query.userEmail = userEmail;

    const post = await db.collection("mallu_mart").findOne(query);

    if (!post) return NextResponse.json({ error: "Unauthorized or not found" }, { status: 401 });

    // 2. Batch Delete from Supabase
    // Uses paths from DB if not provided in request body
    const finalPaths = imagePaths || post.imagePaths || (post.imagePath ? [post.imagePath] : []);
    
    if (finalPaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('mallu-mart')
        .remove(finalPaths);
      
      if (storageError) console.error("Storage Cleanup Error:", storageError);
    }

    // 3. Delete from MongoDB
    await db.collection("mallu_mart").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Cleaned up successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}