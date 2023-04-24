import express from "express";

const app = express();

app.post('/sms', async (req, res) => {
  const to = req.body.to;
  const from = req.body.from;
  const body = req.body.body;
  const result = await sendSMS(to, from, body);
  if (result) {
    res.status(200).send('SMS sent successfully');
  } else {
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
