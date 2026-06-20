import EventEmitter from 'events';
import logger from '../../shared/logger.js';
const authEmitter = new EventEmitter();
import { sendEmail } from '../../shared/email.js';

// 1️⃣ OTP Sending Event
authEmitter.on('send-otp', async (payload) => {
  const { email, name, otp } = payload;
  try {
    const html = `<h1>Hi ${name}</h1><p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;
    await sendEmail(email, 'Verify Your Account - TrustSurgery', '', html);
    logger.info(`✅ OTP Email sent successfully to ${email}`);
  } catch (error) {
    logger.error('❌ Failed to send OTP email:', error);
  }
});

// 2️⃣ Signup Confirmation Event
authEmitter.on('signup-confirm', async (payload) => {
  const { email, name } = payload;
  try {
    const html = `<h1>Welcome ${name}!</h1><p>Your account has been successfully created. Thank you for joining TrustSurgery.</p>`;
    await sendEmail(email, 'Welcome to TrustSurgery!', html);
    logger.info(`✅ Signup Confirmation Email sent to ${email}`);
  } catch (error) {
    logger.error('❌ Failed to send Signup Confirmation email:', error);
  }
});

// 3️⃣ Payment Success Event
authEmitter.on('payment-success', async (payload) => {
  const { email, name, amount, transactionId } = payload;
  try {
    const html = `
      <h1>Payment Successful!</h1>
      <p>Thank you ${name} for your payment.</p>
      <p><strong>Amount Paid:</strong> $${amount}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
    `;
    await sendEmail(email, 'Payment Receipt - TrustSurgery', html);
    logger.info(`✅ Payment Success Email sent to ${email}`);
  } catch (error) {
    logger.error('❌ Failed to send Payment Success email:', error);
  }
});

export default authEmitter;
