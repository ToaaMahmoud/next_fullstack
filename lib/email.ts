import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

export function generateVerificationEmail(token: string): string {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  return `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email:</p>
    <a href="${verificationUrl}">Verify Email</a>
  `;
}

export function generatePasswordResetEmail(token: string): string {
  const resetUrl = `${process.env.NEXTAUTH_URL}/api/auth/reset-password?token=${token}`;
  return `
    <h1>Password Reset</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
  `;
}
