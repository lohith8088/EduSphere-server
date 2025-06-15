import { createTransport } from "nodemailer"

const sendmail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>OTP Verification</title>
<style>
  /* styles omitted for brevity */
</style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p class="message">Hello ${data.name}, your One-Time Password (OTP) for account verification is:</p>
    <p class="otp">${data.otp}</p>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject,
    html,
  });
};

export default sendmail;

export const sendForgotMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    /* styles omitted for brevity */
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hello,</p>
    <p>We received a request to reset the password for your account. To proceed, please click the button below:</p>
    
    <div style="text-align: center;">
      <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button">Reset My Password</a>
    </div>

    <p class="text-muted">This link will expire in 24 hours. If you didn't request a password reset, please ignore this email.</p>
    
    <div class="footer">
      <p>Thank you,<br><strong>The ${process.env.APP_NAME || 'Your Website'} Team</strong></p>
      <p><a href="${process.env.frontendurl}">${process.env.frontendurl}</a></p>
      <p class="text-muted">© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Your Company'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject,
    html,
  });
};
