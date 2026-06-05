export async function POST(req) {
  try {
    const body = await req.json();
    const { email, id } = body;

    if (!email || !id) {
      return new Response(
        JSON.stringify({ error: "Missing email or id" }),
        { status: 400 }
      );
    }

    console.log("📧 EMAIL SENT");
    console.log("To:", email);
    console.log(`Shipment ${id} created successfully 🚚`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email simulated successfully",
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}