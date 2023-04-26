export const userSignup = (req, res) => {
  console.log('req.body', req.body);
  return res.status(201).json({ data: req.body });
};

export const userLogin = (req, res) => {
  console.log('req.body', req.body);
  return res.status(200).json({ data: req.body });
};
