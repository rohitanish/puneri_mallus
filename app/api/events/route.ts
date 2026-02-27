import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Define the interface locally
interface TribeEvent {
  date: string;
  time: string;
  [key: string]: any; 
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("punerimallus");
    
    // 1. Fetch data with a fallback to an empty array
    const events = (await db.collection("events").find({}).toArray() as unknown as TribeEvent[]) || [];

    const now = new Date();

    const processedEvents = events.map((event) => {
      // 2. Combine date and time to check if event has passed
      const eventDateTime = new Date(`${event.date} ${event.time}`);
      
      return {
        ...event,
        // If date is invalid, we default to true to keep it visible
        isUpcoming: isNaN(eventDateTime.getTime()) ? true : eventDateTime >= now
      };
    });

    return NextResponse.json(processedEvents);
  } catch (error: any) {
    console.error("GET_EVENTS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}