import { Resend } from 'resend';

// Only initialize if API key exists, otherwise let it fail gracefully when called
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
  if (!resend) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
  }

  const from = `${fromName} <${fromEmail}>`;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
