import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 1. Connect to MongoDB and wipe the social profile
    const client = await clientPromise;
    const db = client.db("punerimallus");
    await db.collection("profiles").deleteOne({ supabase_id: userId });

    // 2. Initialize Supabase Admin (Required for Auth deletion)
    // You need your SERVICE_ROLE_KEY from Supabase Dashboard for this
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // 3. Delete the user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Deletion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}