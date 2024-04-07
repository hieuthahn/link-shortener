import config from '@/config/config';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() =>
      console.log('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    );
}

const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.auth.resetPasswordUrl.replace('{token}', token)}`;
  const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendVerifyEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.auth.verifyEmailUrl.replace('{token}', token)}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export { transport, sendEmail, sendResetPasswordEmail, sendVerifyEmail };
