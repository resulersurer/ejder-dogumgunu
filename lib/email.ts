import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.com.tr',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  fromName,
  fromEmail,
}: {
  to: string;
  subject: string;
  html: string;
  fromName: string;
  fromEmail: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP credentials are not defined in environment variables');
  }

  // We format the sender as "Name <email>"
  const from = `${fromName} <${fromEmail}>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return info;
}
