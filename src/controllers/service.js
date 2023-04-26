export const handleSendSMS = async (req, res) => {
  const { to, from, content } = req.body;
  // const result = await sendSMS(to, from, content);
  const result = true;
  if (result) return res.status(200).json({ message: 'SMS sent successfully' });
  return res.status(500).json({ message: 'Failed to send SMS' });
};

export const handleSendEmail = async (req, res) => {
  const { to, from, subject, content } = req.body;
  // const result = await sendEmail(to, from, subject, content);
  const result = true;
  if (result) {
    return res.status(200).json({ message: 'Email sent successfully' });
  }
  return res.status(500).json({ message: 'Failed to send email' });
};
