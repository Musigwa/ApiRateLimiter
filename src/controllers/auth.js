import User from 'models/User';
import bcrypt from 'bcrypt';
import { UserSchema } from 'validations';
import { StatusCodes } from 'http-status-codes';
import { errorMessage, successMessage } from '@constants';

const { BAD_REQUEST, CREATED, UNAUTHORIZED, OK, CONFLICT } = StatusCodes;

export const createAccount = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const err = new Error(errorMessage[BAD_REQUEST]);
    err.status = BAD_REQUEST;
    const { error } = UserSchema.validate(req.body);
    if (error) {
      err.message = error.details[0].message;
      throw err;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      err.message = errorMessage[CONFLICT](User.modelName);
      throw err;
    }
    const newUser = new User({ email, password, firstName, lastName });
    const createdUser = await newUser.save();
    res.set('X-Access-Token', createdUser.generateAccessToken());
    return res.status(CREATED).json({
      message: errorMessage[CREATED](User.modelName),
      data: createdUser.toJSON(),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const err = new Error(errorMessage[UNAUTHORIZED]);
    err.status = UNAUTHORIZED;
    const user = await User.findOne({ email });
    if (!user) throw err;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw err;
    res.set('X-Access-Token', user.generateAccessToken());
    return res.status(OK).json({
      message: successMessage[OK]('authenticated'),
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
