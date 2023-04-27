import sgMail from '@sendgrid/mail';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import twilio from 'twilio';

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
  const msg = { to, from, subject, html: body };
  try {
    const [first] = await sgMail.send(msg);
    console.log(`Email sent to ${to} with status code: ${first.statusCode}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const { MAX_REQ_PER_INTERVAL = 10, REQ_INTERVAL_SECS = 60 } = process.env;
const maxRequestsPerInterval = parseInt(MAX_REQ_PER_INTERVAL); // Maximum requests allowed per interval
const intervalSeconds = parseInt(REQ_INTERVAL_SECS); // Interval duration in seconds

export const redisClient = new Redis();
// Initialize the rate limiter for hard throttle
export const rateLimiter = (options = {}) =>
  new RateLimiterRedis({
    ...options,
    storeClient: redisClient,
    points: maxRequestsPerInterval,
    duration: intervalSeconds,
  });
