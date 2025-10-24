import nodemailer from 'nodemailer';

async function sendStyledOTP(recipientEmail, otp) {
  // Create a test account and SMTP transporter
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Compose the email. Replace with your HTML template if needed.
  const mailOptions = {
    from: '"Test OTP" <no-reply@example.com>',
    to: recipientEmail,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP: ${otp}</h2>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${recipientEmail}. Preview: ${nodemailer.getTestMessageUrl(info)}`);
}

export default sendStyledOTP;
