import nodemailer from 'nodemailer';

// 1. Create the transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: `"Puneri Mallus Tribe" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🔐 Your Tribe Verification Code",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; background: #000; color: #fff; padding: 30px; border-radius: 20px; border: 1px solid #333; text-align: center;">
        <h2 style="color: #ff0000; text-transform: uppercase;">Verify your Access</h2>
        <p style="font-size: 14px; color: #ccc;">Welcome to the tribe. Use the code below to complete your registration:</p>
        <div style="background: #111; padding: 20px; font-size: 36px; font-weight: 900; letter-spacing: 8px; margin: 20px 0; border: 1px dashed #ff0000; color: #fff;">
          ${token}
        </div>
        <p style="font-size: 10px; color: #666;">This code is valid for 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};