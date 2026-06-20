import nodemailer from 'nodemailer';
import logger from './logger.js';
import config from '../config/index.js';

const hasEmailConfig =
  config.email.host &&
  config.email.port &&
  config.email.user &&
  config.email.pass &&
  config.email.from;

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    })
  : null;

export const sendEmail = async (to, subject, text, html) => {
  if (!transporter) {
    logger.error('Email transport is not configured. Check SMTP_* variables.');
    throw new Error('Email service is not configured');
  }

  try {
    const mailOptions = {
      from: config.email.from,
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
