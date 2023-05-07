import { StatusCodes } from 'http-status-codes';
import { successMessage } from '@constants';

const { OK } = StatusCodes;

export const handleSendSMS = async (req, res, next) => {
  try {
    const { to, from, content } = req.body;
    // const result = await sendSMS(to, from, content);
    const result = true;
    if (result)
      return res.status(OK).json({
        message: successMessage[OK]('sent', 'SMS'),
      });
    const error = new Error('Failed to send SMS');
    throw error;
  } catch (error) {
    next(error);
  }
};

export const handleSendEmail = async (req, res, next) => {
  try {
    const { to, from, subject, content } = req.body;
    // const result = await sendEmail(to, from, subject, content);
    const result = true;
    if (result)
      return res.status(OK).json({
        message: successMessage[OK]('sent', 'Email'),
      });
    const error = new Error('Failed to send Email');
    throw error;
  } catch (error) {
    next(error);
  }
};
