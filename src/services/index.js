import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import winston from 'winston';

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

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
