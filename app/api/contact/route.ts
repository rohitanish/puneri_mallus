import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { dbConnect } from '@/lib/mongodb';// Your singleton connection helper
import SupportTicket from '@/models/SupportTicket'; // Your MongoDB model

export async function POST(req: Request) {
  try {
    // 1. Establish Node Connection to MongoDB
    await dbConnect();

    // 2. Extract Transmission Data
    const { name, email, subject, message } = await req.json();

    // 3. Inject into MongoDB as a Support Ticket
    const ticket = await SupportTicket.create({
      name,
      email,
      subject,
      message,
      status: 'OPEN' // Default status
    });

    // 4. Setup Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Setup Cinematic Email Template
    const mailOptions = {
      from: email,
      to: 'punerimallus@gmail.com',
      subject: `[TICKET #${ticket._id.toString().slice(-6)}] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 20px; border: 1px solid #1a1a1a;">
          
          <div style="border-bottom: 2px solid #ff0000; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0;">
              Support <span style="color: #ff0000;">Message</span>
            </h1>
            <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">
              System Transmission // TICKET ID: ${ticket._id}
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <div style="background-color: #0f0f0f; padding: 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #1a1a1a;">
              <span style="color: #ff0000; font-size: 10px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 5px;">Origin Sender</span>
              <span style="font-size: 16px; font-weight: bold;">${name}</span>
            </div>
            
            <div style="background-color: #0f0f0f; padding: 15px; border-radius: 12px; border: 1px solid #1a1a1a;">
              <span style="color: #ff0000; font-size: 10px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 5px;">Return Address</span>
              <a href="mailto:${email}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">${email}</a>
            </div>
          </div>

          <div style="background-color: #0f0f0f; padding: 25px; border-radius: 20px; border-left: 4px solid #ff0000;">
            <span style="color: #ff0000; font-size: 10px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 15px;">Transmission Content</span>
            <p style="font-size: 15px; line-height: 1.6; color: #cccccc; margin: 0; white-space: pre-wrap;">
              ${message}
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${email}?subject=Re: [TICKET #${ticket._id.toString().slice(-6)}] ${subject}" 
               style="background-color: #ff0000; color: #ffffff; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
               Initialize Response
            </a>
          </div>

          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 20px;">
            <p style="color: #444; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
              © 2026 PM Community Nodes // Pune Hub
            </p>
          </div>
        </div>
      `,
    };

    // 6. Execute Transmission
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Transmission Logged & Sent" }, { status: 200 });

  } catch (error: any) {
    console.error("Transmission Protocol Failure:", error);
    return NextResponse.json({ message: "Transmission Failed" }, { status: 500 });
  }
}