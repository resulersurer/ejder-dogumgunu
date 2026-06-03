import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getNowInTurkey, isBirthdayToday } from '@/lib/date';
import { sendEmail } from '@/lib/email';
import { renderTemplate } from '@/lib/template';
import { toZonedTime } from 'date-fns-tz';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.emailSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json({ message: 'Email settings not configured. Skipping.' });
    }

    if (!settings.isCronEnabled) {
      return NextResponse.json({ message: 'Cron job is disabled in settings. Skipping.' });
    }

    // Aktif tüm çalışanları al
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
    });

    const todayInTurkey = getNowInTurkey();
    const currentYear = todayInTurkey.getFullYear();

    let sentCount = 0;
    let failedCount = 0;

    for (const employee of employees) {
      // Doğum günü bugün mü kontrol et
      if (!isBirthdayToday(employee.birthDate)) {
        continue;
      }

      // Bu yıla ait daha önce 'SENT' kaydı var mı kontrol et
      const existingLog = await prisma.birthdayEmailLog.findUnique({
        where: {
          employeeId_year: {
            employeeId: employee.id,
            year: currentYear,
          },
        },
      });

      if (existingLog && existingLog.status === 'SENT') {
        continue; // Zaten gönderilmiş
      }

      // Şablonu derle
      const htmlContent = renderTemplate(settings.htmlTemplate, employee, currentYear);

      try {
        // Mail gönderimi yap
        await sendEmail({
          to: employee.email,
          subject: settings.subject,
          html: htmlContent,
          fromName: settings.fromName,
          fromEmail: settings.fromEmail,
        });

        // Başarılı ise kaydet veya güncelle (eğer FAILED olarak kaldıysa)
        await prisma.birthdayEmailLog.upsert({
          where: {
            employeeId_year: { employeeId: employee.id, year: currentYear },
          },
          update: {
            status: 'SENT',
            error: null,
            sentAt: new Date(),
          },
          create: {
            employeeId: employee.id,
            year: currentYear,
            status: 'SENT',
          },
        });
        
        sentCount++;
      } catch (error: any) {
        // Hata durumunda FAILED olarak kaydet
        await prisma.birthdayEmailLog.upsert({
          where: {
            employeeId_year: { employeeId: employee.id, year: currentYear },
          },
          update: {
            status: 'FAILED',
            error: error.message,
            sentAt: new Date(),
          },
          create: {
            employeeId: employee.id,
            year: currentYear,
            status: 'FAILED',
            error: error.message,
          },
        });
        
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed birthdays. Sent: ${sentCount}, Failed: ${failedCount}`,
    });
  } catch (error: any) {
    console.error('CRON ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
