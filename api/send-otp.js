export default async function handler(req, res) {
 
  const proxyUrl = "http://localhost:8080/";
  const targetUrl = "https://script.google.com/macros/s/AKfycbx_io7IFLs3RfW09-9wMuN8SsSfXbjwrCJekpatOZwQEtzaAG6784FtZJOjK7xY-OfI0Q/exec";

  

  try {
    const gasResponse = await fetch(proxyUrl + targetUrl, {
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
