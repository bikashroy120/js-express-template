import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mdrakibulhasan12346@gmail.com',
    pass: 'rbyz nvgi eppd rwqm',
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"TrustSurgery" <mdrakibulhasan12346@gmail.com>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('✅ Email sent: ' + info.response);
    return info;
  } catch (error) {
    logger.error('❌ Email error:', error);
    throw error;
  }
};
