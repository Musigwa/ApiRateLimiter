import Joi from 'joi';

export const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
});
