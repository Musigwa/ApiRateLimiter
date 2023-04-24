import twilio from "twilio";
import { accountSid, authToken } from "../utils";

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, from, body) => {
  try {
    const message = await client.messages.create({
      to,
      from,
      body
    });
    console.log(`SMS sent to ${to}: ${message.sid}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
