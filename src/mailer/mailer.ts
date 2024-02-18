const nodemailer = require('nodemailer');
import { config } from 'dotenv';

config();

console.log(process.env.Email);
console.log(process.env.PASSWORD);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3',
  },
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export async function sendEmail(email: string, code: string) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'VERIFICATION CODE',
    html: `<b>Here is your verification code: ${code}</b>`,
  });
  console.log('Message sent: %s', info.messageId);
}
