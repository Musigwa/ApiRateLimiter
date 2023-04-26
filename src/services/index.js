import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import rateLimit from 'express-rate-limit';
import * as redis from 'redis';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY } = process.env;
const { messages } = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * This function takes the recipient phone number, sender phone number, and SMS body as arguments.
 * @author Musigwa Pacifique
 * @param {*} to The receipt number to send the message to.
 * @param {*} from The sender's phone number from which the message will be sent
 * @param {*} body The message body to send to the recipient.
 * @return {boolean} True if the message was sent successfully. And false otherwise.
 */
export const sendSMS = async (to, from, body) => {
  try {
    const { sid, status } = await messages.create({ to, from, body });
    console.log(`SMS sent to ${to}: ${sid} with status: ${status}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * This function takes the recipient email, sender email, subject, and content as arguments.
 * @author Musigwa Pacifique
 * @param {*} to The receipt email address to send the email message to
 * @param {*} from The sender's email address from which the email will be sent
 * @param {*} subject The subject/headline/reason for the email to send to the recipient.
 * @param {*} body The email message body to send to the recipient.
 * @return {boolean} True if the message was sent successfully. And false otherwise.
 */
export const sendEmail = async (to, from, subject, body) => {
  const msg = {
    to,
    from,
    subject,
    html: body,
  };
  try {
    const [first] = await sgMail.send(msg);
    console.log(`Email sent to ${to} with status code: ${first.statusCode}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const redisClient = redis.createClient();

// Create Redis store for rate limiter
const { MAX_RATE_LIMIT = 10, WINDOW_MILLISECONDS = 60 } = process.env;
export const rateLimiter = rateLimit({
  max: MAX_RATE_LIMIT, // maximum requests per minute
  windowMs: WINDOW_MILLISECONDS * 1000, // converted into seconds
  store: new RedisStore({ client: redisClient }),
  message: `You can only make as many requests as ${MAX_RATE_LIMIT} within ${Math.floor(
    WINDOW_MILLISECONDS / 60
  )} minute(s) window. Please try again later.`,
});

export const checkRateLimit = (clientId, maxRequests, intervalSeconds) =>
  new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000); // Now into seconds
    const key = `client:${clientId}`; // Client ID for the request
    const intervalStart = now - intervalSeconds;

    redisClient
      .multi()
      .zadd(key, now, now)
      .zremrangebyscore(key, 0, intervalStart)
      .zcard(key)
      .expire(key, intervalSeconds)
      .exec((err, results) => {
        if (!err) {
          const numRequests = results[2];
          const isRateLimited = numRequests > maxRequests;
          const resetTime = now + (intervalSeconds - (now - intervalStart));
          resolve({ isRateLimited, resetTime });
        } else reject(err);
      });
  });
