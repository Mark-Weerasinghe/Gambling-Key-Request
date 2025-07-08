export default async function handler(req, res) {
  // Enable CORS for your frontend domain
  res.setHeader("Access-Control-Allow-Origin", "https://gambling-key-request.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Parse body safely
  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    console.error("Error parsing request body:", e);
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  // Email mapping per onramp
  const onrampEmailMap = {
    BTCDirect: "mark.weerasinghe+btc@onramper.com",
    Coinify: "support@coinify.com",
    Koywe: "support@koywe.com",
    Localramp: "support@localramp.com",
    Moonpay: "support@moonpay.com",
    Onrampmoney: "support@onrampmoney.com",
    Swapped: "support@swapped.com",
    Topper: "support@topper.com",
    Transfi: "support@transfi.com"
  };

  const { onramp } = payload;
  const recipientEmail = onrampEmailMap[onramp];

  if (!recipientEmail) {
    return res.status(400).json({ error: `Unknown onramp: ${onramp}` });
  }

  // Add recipientEmail to payload before sending to GAS
  const updatedPayload = {
    ...payload,
    recipientEmail
  };

  const targetUrl = "https://script.google.com/macros/s/AKfycbx_io7IFLs3RfW09-9wMuN8SsSfXbjwrCJekpatOZwQEtzaAG6784FtZJOjK7xY-OfI0Q/exec";

  try {
    const gasResponse = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPayload)
    });

    if (!gasResponse.ok) {
      const errorText = await gasResponse.text();
      console.error("GAS Email Failed:", errorText);
      return res.status(500).json({ error: "Failed to send email via Google Apps Script" });
    }

    return res.status(200).json({ message: "Email sent via GAS successfully" });

  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}