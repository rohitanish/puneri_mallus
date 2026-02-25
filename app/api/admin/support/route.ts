import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function GET() {
  try {
    await dbConnect();
    // Fetch tickets sorted by newest first
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// Logic to delete or update status
export async function PATCH(req: Request) {
    try {
      await dbConnect();
      const { id, status } = await req.json();
      await SupportTicket.findByIdAndUpdate(id, { status });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}