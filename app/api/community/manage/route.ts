import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to extract filename from Supabase URL
const getFileName = (url: string) => {
  if (!url || !url.includes('community/')) return null;
  const parts = url.split('/');
  return parts[parts.length - 1].split('?')[0];
};

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    const data = await req.json();
    const { _id, ...body } = data;

    if (body.category) body.category = body.category.toUpperCase();

    if (_id) {
      if (!ObjectId.isValid(_id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }

      // 1. Fetch the current node to see what images it has right now
      const oldNode = await db.collection("community_circles").findOne({ 
        _id: new ObjectId(_id) 
      });

      if (oldNode) {
        // 2. Sanitation Logic for Multiple Images
        // Get all unique URLs from the old record (thumbnail + gallery)
        const oldImages = new Set([oldNode.image, ...(oldNode.imagePaths || [])].filter(Boolean));
        
        // Get all unique URLs from the incoming update
        const newImages = new Set([body.image, ...(body.imagePaths || [])].filter(Boolean));

        // Find images that exist in the old set but NOT in the new set
        const filesToDelete = Array.from(oldImages)
          .filter(url => !newImages.has(url))
          .map(url => getFileName(url))
          .filter(Boolean) as string[];

        // 3. Purge orphaned files from Supabase Storage
        if (filesToDelete.length > 0) {
          try {
            const { error: purgeError } = await supabaseAdmin.storage
              .from('community')
              .remove(filesToDelete);
            
            if (purgeError) console.error("SUPABASE_PURGE_ERROR:", purgeError);
          } catch (err) {
            console.error("ASSET_CLEANUP_WARNING:", err);
          }
        }
      }

      // 4. Update document
      await db.collection("community_circles").updateOne(
        { _id: new ObjectId(_id) },
        { 
          $set: { 
            ...body, 
            updatedAt: new Date() 
          } 
        }
      );
      
      return NextResponse.json({ message: "Node successfully updated" });
    } else {
      // Create logic remains same
      const result = await db.collection("community_circles").insertOne({
        ...body,
        createdAt: new Date(),
        isVerified: body.isVerified || false,
        services: body.services || []
      });
      
      return NextResponse.json(result);
    }
  } catch (e: any) {
    console.error("COMMUNITY_MANAGE_CRITICAL_ERROR:", e);
    return NextResponse.json({ error: "Storage or database sync failed" }, { status: 500 });
  }
}