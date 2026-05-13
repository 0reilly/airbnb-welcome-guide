export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Store in simple JSON file on Vercel (ephemeral but fine for validation)
  // Primary: send notification via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HostGuide <hostguide@sweetcli.com>',
        to: 'design0reilly@gmail.com',
        subject: '🔥 New Airbnb Guide Waitlist Signup!',
        html: `<h2>New waitlist signup!</h2><p><strong>Email:</strong> ${email}</p><p>Time: ${new Date().toISOString()}</p>`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send confirmation' });
    }

    return res.status(200).json({ success: true, message: 'You are on the list!' });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
