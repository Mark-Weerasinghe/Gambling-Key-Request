export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://gambling-key-request.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight request
  }

  const payload = req.body;

  try {
    const gasResponse = await fetch("https://script.google.com/macros/s/AKfycbx_io7IFLs3RfW09-9wMuN8SsSfXbjwrCJekpatOZwQEtzaAG6784FtZJOjK7xY-OfI0Q/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
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