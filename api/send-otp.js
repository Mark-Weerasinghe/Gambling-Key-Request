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

  // Parse JSON body explicitly (if not parsed by default)
  let payload;
  try {
    payload = req.body;
    // If req.body is a string (not parsed), parse it:
    if (typeof payload === "string") {
      payload = JSON.parse(payload);
    }
  } catch (e) {
    console.error("Error parsing request body:", e);
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  const targetUrl = "https://script.google.com/macros/s/AKfycbx_io7IFLs3RfW09-9wMuN8SsSfXbjwrCJekpatOZwQEtzaAG6784FtZJOjK7xY-OfI0Q/exec";

  try {
    const gasResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!gasResponse.ok) {
      const errorText = await gasResponse.text();
      console.error("GAS OTP Email Failed:", errorText);
      return res.status(500).json({ error: "Failed to send OTP via Google Apps Script" });
    }

    return res.status(200).json({ message: "OTP sent via GAS successfully" });

  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}