export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const settings = await prisma.emailSettings.findFirst();

  async function updateSettings(formData: FormData) {
    'use server';
    
    const fromName = formData.get('fromName') as string;
    const fromEmail = formData.get('fromEmail') as string;
    const subject = formData.get('subject') as string;
    const htmlTemplate = formData.get('htmlTemplate') as string;
    const isCronEnabled = formData.get('isCronEnabled') === 'on';

    if (settings) {
      await prisma.emailSettings.update({
        where: { id: settings.id },
        data: {
          fromName,
          fromEmail,
          subject,
          htmlTemplate,
          isCronEnabled,
        },
      });
    } else {
      await prisma.emailSettings.create({
        data: {
          fromName,
          fromEmail,
          subject,
          htmlTemplate,
          isCronEnabled,
        },
      });
    }

    revalidatePath('/admin/settings');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gönderici bilgilerini ve doğum günü e-posta şablonunu buradan yönetebilirsiniz.
        </p>
      </div>

      <SettingsForm initialSettings={settings} updateAction={updateSettings} />
    </div>
  );
}
