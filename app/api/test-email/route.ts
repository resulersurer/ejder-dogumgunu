import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { renderTemplate } from '@/lib/template';

export async function POST(request: NextRequest) {
  try {
    const { toEmail } = await request.json();

    if (!toEmail) {
      return NextResponse.json({ error: 'toEmail is required' }, { status: 400 });
    }

    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ error: 'Email settings not configured' }, { status: 400 });
    }

    // Dummy employee for test
    const dummyEmployee: any = {
      firstName: 'Test',
      lastName: 'Kullanıcı',
      department: 'Yazılım',
      email: toEmail,
    };

    const htmlContent = renderTemplate(settings.htmlTemplate, dummyEmployee, new Date().getFullYear());

    await sendEmail({
      to: toEmail,
      subject: `[TEST] ${settings.subject}`,
      html: htmlContent,
      fromName: settings.fromName,
      fromEmail: settings.fromEmail,
    });

    return NextResponse.json({ success: true, message: 'Test email sent successfully' });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
