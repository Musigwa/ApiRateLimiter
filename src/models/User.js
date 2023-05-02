import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { dbConnection } from '../configs/databases';
import jwt from 'jsonwebtoken';

const { REFRESH_TOKEN_SECRET } = process.env;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name should be at least 2 characters long'],
    maxlength: [50, 'First name should be at most 50 characters long'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name should be at least 2 characters long'],
    maxlength: [50, 'Last name should be at most 50 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password should be at least 8 characters long'],
    maxlength: [100, 'Password should be at most 100 characters long'],
    // select: false,
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.toJSON = function (excludeKeys = []) {
  excludeKeys.push('password');
  const user = this.toObject();
  excludeKeys.forEach((key) => delete user[key]);
  return user;
};

userSchema.methods.generateAccessToken = function () {
  const { _id, email } = this;
  const { JWT_SECRET, JWT_EXPIRES_IN = '1h' } = process.env;
  const options = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign({ _id, email }, JWT_SECRET, options);
};

userSchema.methods.generateRefreshToken = function () {
  const { _id, email } = this;
  return jwt.sign({ _id, email }, REFRESH_TOKEN_SECRET);
};

export default dbConnection.model('User', userSchema);
