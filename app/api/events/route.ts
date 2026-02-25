import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Define the interface locally or import it
interface TribeEvent {
  date: string;
  time: string;
  [key: string]: any; // Allows for other mongo properties like _id
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // Explicitly type the array coming from MongoDB
    const events = await db.collection("events").find({}).toArray() as unknown as TribeEvent[];

    const now = new Date();

    const processedEvents = events.map((event) => {
      // TypeScript now knows 'event.date' and 'event.time' exist
      const eventDateTime = new Date(`${event.date} ${event.time}`);
      
      return {
        ...event,
        isUpcoming: isNaN(eventDateTime.getTime()) ? true : eventDateTime >= now
      };
    });

    return NextResponse.json(processedEvents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}