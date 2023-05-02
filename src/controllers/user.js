import User from '../models/User';
import bcrypt from 'bcrypt';
import { UserSchema } from '../validations';

export const createAccount = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const err = new Error('Failed to create user account');
    err.status = 400;
    const { error } = UserSchema.validate(req.body);
    if (error) {
      err.message = error.details[0].message;
      throw err;
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      err.message = 'User already exists';
      throw err;
    }
    const newUser = new User({ email, password, firstName, lastName });
    const createdUser = await newUser.save();
    res.set('X-Access-Token', createdUser.generateAccessToken());
    return res.status(201).json({
      message: 'User created successfully',
      data: createdUser.toJSON(),
    });
  } catch (error) {
    console.log(error);
    const { status = 500, message = 'Internal Server Error' } = error;
    return res.status(status).json({ error: message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const err = new Error('Please provide valid credentials');
    err.status = 401;
    const user = await User.findOne({ email });
    if (!user) throw err;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw err;
    res.set('X-Access-Token', user.generateAccessToken());
    return res.status(200).json({
      message: 'You are successfully authenticated!',
      data: user.toJSON(),
    });
  } catch (error) {
    // console.log(error);
    const { status = 500, message = 'Internal Server Error' } = error;
    return res.status(status).json({ error: message });
  }
};
