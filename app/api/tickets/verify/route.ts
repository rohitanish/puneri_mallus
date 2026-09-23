import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import crypto from 'crypto';
import QRCode from 'qrcode'; 
import { sendEventTicketEmail } from '@/lib/mail';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, email, eventId, totalAmount, eventData, pointsToRedeem = 0 } = await req.json();

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) throw new Error("Invalid payment signature.");

    // 🔥 FETCH ROOT IDENTITY EARLY
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();

    const { data: categories } = await supabase.from('event_ticket_categories').select('*').eq('event_id', eventId);
    if (!categories) throw new Error("Categories not found");

    let issuedTickets = [];

															
    for (const [categoryId, qty] of Object.entries(cart)) {
      const category = categories.find(c => c.id === categoryId);
      if (!category) continue;
      let currentSold = category.sold;

      for (let i = 0; i < (qty as number); i++) {
        currentSold++;
        const ticketNumber = `${category.prefix}${String(currentSold).padStart(3, '0')}`;
        issuedTickets.push({ 
          categoryName: category.name, 
          ticketNumber,
          status: "ISSUED" 
        });
      }
      await supabase.from('event_ticket_categories').update({ sold: currentSold }).eq('id', categoryId);
    }

    // 🔥 SAVE THE ROOT USER_ID ALONGSIDE THE EMAIL
    const { data: booking, error: bookingErr } = await supabase.from('ticket_bookings').insert({
      event_id: eventId, 
      user_id: user?.id || null, // Binds booking to the logged-in phone number identity
      email, 
      amount_paid: totalAmount, 
      razorpay_payment_id, 
      razorpay_order_id, 
      tickets_data: issuedTickets,
    }).select().single();
    
    if (bookingErr) throw bookingErr;

    // 🔥 AUTOMATED LOYALTY POINT ALLOCATION & REDEMPTION
																					  
    let profile: any = null;
    
    try {
										  
											  
											  
												   
																				   
		

																   

      if (user) {
															   
        const { data: p } = await supabase
          .from('profiles')
          .select('id, is_member, loyalty_points')
          .eq('id', user.id)
          .single();
          
        profile = p;

																			  
        const client = await clientPromise;
        const db = client.db("punerimallus");
        const eventDoc = await db.collection("events").findOne({ _id: new ObjectId(eventId) });

        if (eventDoc) {
          const isMember = profile?.is_member || false;
																 
          const pointsToAdd = isMember 
            ? (eventDoc.memberPoints || 0) 
            : (eventDoc.nonMemberPoints || 0);

          const currentPoints = profile?.loyalty_points || 0;
          
																		
          const adjustedBalance = Math.max(0, currentPoints - pointsToRedeem);
          const finalBalance = adjustedBalance + pointsToAdd;

													  
          await supabase
            .from('profiles')
            .update({ loyalty_points: finalBalance })
            .eq('id', user.id);
        }
      }
    } catch (pointErr) {
      console.error("Loyalty points allocation failed:", pointErr);
																						
    }

    // 🔥 FETCH LOGO FOR PDF HEADER
    let logoBase64 = null;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000';
      const logoRes = await fetch(`${baseUrl}/logo_main.png`);
      const logoBuffer = await logoRes.arrayBuffer();
      logoBase64 = `data:image/png;base64,${Buffer.from(logoBuffer).toString('base64')}`;
    } catch (e) { 
      console.error("Failed to fetch Puneri Mallus logo"); 
    }

    // ==========================================
    // GENERATE PROFESSIONAL INVOICE E-TICKET
    // ==========================================
    const doc = new jsPDF();
    
    for (let index = 0; index < issuedTickets.length; index++) {
      const ticket = issuedTickets[index];
      
																
      const rawCatPrice = categories.find(c => c.name === ticket.categoryName)?.price || 0;
      const hasMemberDiscount = profile?.is_member && (eventData?.memberDiscount || 0) > 0;
      
      const catPrice = hasMemberDiscount 
        ? rawCatPrice - ((rawCatPrice * eventData.memberDiscount) / 100)
        : rawCatPrice;

															
      const fee = Math.round(catPrice / (1 - 0.0236)) - catPrice;
      const ticketTotal = catPrice + fee;

      if (index > 0) doc.addPage();
      
      // 1. HEADER SECTION
      if (logoBase64) {
        doc.setFillColor(15, 15, 15);
        doc.roundedRect(20, 15, 40, 30, 2, 2, 'F');
        doc.addImage(logoBase64, 'PNG', 22, 17, 36, 26); 
      } else {
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("PUNERI MALLUS", 20, 25);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("OFFICIAL E-TICKET", 190, 32, { align: "right" });

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(20, 52, 190, 52); 

      // 2. ORDER INFO
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Booking ID: ${booking.id.split('-')[0].toUpperCase()}`, 20, 60);
      doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 20, 65);
      doc.text(`Purchaser: ${email}`, 20, 70);

      // 3. EVENT DETAILS BOX 
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(20, 80, 170, 35, 2, 2, 'S'); 

      doc.setTextColor(0, 0, 0); 
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize((eventData?.title || 'EXCLUSIVE EVENT').toUpperCase(), 160);
      doc.text(titleLines, 25, 90);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80); 
      doc.text(`Date: ${eventData?.date || 'TBA'}  |  Time: ${eventData?.time || 'TBA'}`, 25, 100);
      doc.text(`Venue: ${eventData?.location || 'TBA'}`, 25, 107);

      // 4. GUEST ACCESS PASS BOX
      doc.roundedRect(20, 122, 170, 45, 2, 2, 'S');

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("GUEST ACCESS PASS", 25, 132); 

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Category:", 25, 144);
      doc.text("Ticket No:", 25, 152);
      doc.text("Status:", 25, 160);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(220, 38, 38); 
      doc.text(ticket.categoryName.toUpperCase(), 50, 144);
      doc.setTextColor(0, 0, 0); 
      doc.text(ticket.ticketNumber, 50, 152);
      doc.setTextColor(34, 197, 94); 
      doc.text("CONFIRMED", 50, 160);

      const baseUrlStr = process.env.NEXT_PUBLIC_BASE_URL || 'https://punerimallus.com';
      const scanUrl = `${baseUrlStr}/admin/scanner?bid=${booking.id}&tno=${ticket.ticketNumber}`;
      const qrCodeBase64 = await QRCode.toDataURL(scanUrl, { margin: 1, color: { dark: '#000', light: '#fff' } });

      doc.addImage(qrCodeBase64, 'PNG', 145, 127, 35, 35);
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text("SCAN AT ENTRY", 162.5, 165, { align: "center" });

      // 5. PRICE BREAKDOWN BOX 
      const showDiscount = pointsToRedeem > 0 && index === 0;
												 
      const boxHeight = showDiscount ? 52 : 45; 
      
      doc.roundedRect(20, 175, 170, boxHeight, 2, 2, 'S');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PAYMENT BREAKDOWN", 25, 185);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("Base Ticket Price", 25, 195);
																 
      doc.text(`Rs. ${catPrice.toLocaleString('en-IN')}`, 185, 195, { align: "right" });

      doc.text("Taxes & Convenience Fee (2.36%)", 25, 202);
      doc.text(`Rs. ${fee.toLocaleString('en-IN')}`, 185, 202, { align: "right" });

      let currentY = 202;

										   
      if (showDiscount) {
        currentY += 7;
        doc.text("Tribe Points Applied", 25, currentY);
        doc.setTextColor(34, 197, 94);
        doc.text(`- Rs. ${pointsToRedeem.toLocaleString('en-IN')}`, 185, currentY, { align: "right" });
        doc.setTextColor(80, 80, 80);
      }

      currentY += 5;
      doc.setDrawColor(220, 220, 220);
      doc.line(25, currentY, 185, currentY);

      currentY += 7;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("TOTAL PAID FOR THIS TICKET", 25, currentY);
      doc.setTextColor(220, 38, 38);
      
									 
      const actualTicketTotal = showDiscount ? Math.max(0, ticketTotal - pointsToRedeem) : ticketTotal;
      doc.text(`Rs. ${actualTicketTotal.toLocaleString('en-IN')}`, 185, currentY, { align: "right" });

      // 6. RULES & GUIDELINES
																								   
      const rulesStartY = showDiscount ? 240 : 233;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("RULES & GUIDELINES", 20, rulesStartY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text("1. Please present this e-ticket along with a valid Government ID at the entry gate.", 20, rulesStartY + 7);
      doc.text("2. This ticket is non-refundable, non-transferable, and valid for one person only.", 20, rulesStartY + 12);
      doc.text("3. Entry gates close 30 minutes prior to the show's commencement.", 20, rulesStartY + 17);
      doc.text("4. Any form of outside food, beverages, or hazardous items are strictly prohibited.", 20, rulesStartY + 22);
      doc.text("5. Management reserves the right of admission and may conduct security checks.", 20, rulesStartY + 27);
    }

    const pdfBase64 = doc.output('datauristring').split(',')[1];

    await sendEventTicketEmail(email, booking.id, issuedTickets, totalAmount, pdfBase64, eventData);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}