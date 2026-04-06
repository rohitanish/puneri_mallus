// app/api/auth/send-test-whatsapp/route.ts
export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `91${phoneNumber}`,
          type: "template",
          template: {
            name: "hello_world", // The unblockable default template
            language: { code: "en_US" }
            // Note: hello_world has no components/parameters
          }
        }),
      }
    );

    const data = await response.json();
    return Response.json({ success: response.ok, data });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}