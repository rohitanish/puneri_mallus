import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ exists: false, message: "User ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Check the 'profiles' collection for a matching Supabase ID
    const profile = await db.collection("profiles").findOne(
      { supabase_id: userId }
    );

    // !!profile converts the object to a boolean (true if found, false if null)
    return NextResponse.json({ 
      exists: !!profile,
      profile: profile 
    });
  } catch (error: any) {
    console.error("Profile Lookup Error:", error);
    return NextResponse.json({ 
      exists: false, 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}