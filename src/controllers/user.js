import User from '../models/User';
import bcrypt from 'bcrypt';

export const createAccount = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });
    const newUser = new User({ email, password, firstName, lastName });
    const createdUser = await newUser.save();
    res.set('X-Access-Token', createdUser.generateToken());
    return res.status(201).json({
      message: 'User created successfully',
      data: createdUser.toJSON(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const erroMsg = { unauthorized: 'Invalid email or password' };
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: erroMsg.unauthorized });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: erroMsg.unauthorized });
    res.set('X-Access-Token', user.generateToken());
    return res.status(200).json({
      message: 'You are successfully authenticated!',
      data: user.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
