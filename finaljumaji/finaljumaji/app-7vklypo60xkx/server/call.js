/*
  Simple Express server to trigger an outbound call via Twilio.
  Usage:
    1. npm run start:server
    2. Set environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
    3. POST /call with JSON { to: "+16087659446" }

  NOTE: This is an example and should be secured before use (authentication, rate limits, input validation).
*/

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Twilio call service (example). POST /call' });
});

app.post('/call', async (req, res) => {
  const to = req.body?.to;
  if (!to) return res.status(400).json({ error: 'Missing `to` phone number' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({ error: 'Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM) are required in environment' });
  }

  try {
    const Twilio = await import('twilio');
    const client = Twilio.default(accountSid, authToken);

    // Use Twilio to create a call to the given number. This example uses the TwiML Bin demo URL,
    // replace `url` with your own TwiML webhook or Twilio Function that returns voice instructions.
    const call = await client.calls.create({
      to,
      from,
      url: 'http://demo.twilio.com/docs/voice.xml',
    });

    return res.json({ message: 'Call initiated', sid: call.sid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create call', details: String(err) });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Twilio call server listening on http://localhost:${port}`);
});
