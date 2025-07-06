export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const hubspotWebhookUrl = 'https://api-eu1.hubapi.com/automation/v4/webhook-triggers/25851164/KUgGm5b';

  try {
    const response = await fetch(hubspotWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    res.status(200).json({ message: 'Sent to HubSpot successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
