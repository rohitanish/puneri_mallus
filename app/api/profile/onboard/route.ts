import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 1. Authenticate with Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Form Data
    const body = await request.json();
    const { profession, bio, interests } = body;

    // 3. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("punerimallus");

    // 4. Create or Update the Social Profile
    const profileData = {
      supabase_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "Tribe Member",
      avatar_url: user.user_metadata?.avatar_url || null,
      profession: profession?.trim().toUpperCase() || "MEMBER",
      bio: bio?.trim(),
      interests: Array.isArray(interests) ? interests : [], // Ensure it's an array
      onboarded: true,
      updatedAt: new Date(),
    };

    

    // 5. Atomic Upsert
    await db.collection("profiles").updateOne(
      { supabase_id: user.id },
      { 
        $set: profileData,
        $setOnInsert: { createdAt: new Date() } // Only set creation date once
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Welcome to the Tribe!" });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Onboarding failed. Please try again." }, { status: 500 });
  }
}