'use client';

import { useState } from 'react';
import { Mail, Save, Play } from 'lucide-react';

export default function SettingsForm({ initialSettings, updateAction }: { initialSettings: any, updateAction: (formData: FormData) => Promise<void> }) {
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success?: boolean, message?: string} | null>(null);

  const handleTestEmail = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: testEmail }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.error || 'Bilinmeyen hata' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form action={updateAction} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-indigo-600" />
              E-posta Şablonu ve Ayarlar
            </h2>
            <button type="submit" className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gönderen İsmi</label>
                <input type="text" name="fromName" defaultValue={initialSettings?.fromName || 'İnsan Kaynakları'} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gönderen E-posta</label>
                <input type="email" name="fromEmail" defaultValue={initialSettings?.fromEmail || 'ik@sirket.com'} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mail Konusu</label>
              <input type="text" name="subject" defaultValue={initialSettings?.subject || 'Doğum Günün Kutlu Olsun 🎉'} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HTML Şablonu</label>
              <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                <span className="font-semibold text-gray-700">Desteklenen Değişkenler:</span> {`{{firstName}}, {{lastName}}, {{fullName}}, {{department}}, {{year}}`}
              </div>
              <textarea 
                name="htmlTemplate" 
                rows={10} 
                defaultValue={initialSettings?.htmlTemplate || `<h1>Doğum Günün Kutlu Olsun {{firstName}}! 🎉</h1>\n<p>Yeni yaşında sağlık, mutluluk ve başarılar dileriz.</p>\n<p>Sevgiler,<br />İnsan Kaynakları Ekibi</p>`} 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>

            <div className="flex items-start pt-4 border-t border-gray-200">
              <div className="flex items-center h-5">
                <input id="isCronEnabled" name="isCronEnabled" type="checkbox" defaultChecked={initialSettings?.isCronEnabled ?? true} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isCronEnabled" className="font-medium text-gray-700">Otomatik Gönderim (Cron) Aktif</label>
                <p className="text-gray-500">Kapatıldığında sistem otomatik mail göndermeyi durdurur.</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Test Gönderimi</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Mevcut ayarları kaydettikten sonra, şablonunuzu test etmek için bir e-posta adresine örnek gönderim yapabilirsiniz.</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Test E-posta Adresi</label>
              <input 
                type="email" 
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="test@ornek.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>

            <button 
              onClick={handleTestEmail}
              disabled={isTesting || !testEmail}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2 text-indigo-500" />
              {isTesting ? 'Gönderiliyor...' : 'Test Maili Gönder'}
            </button>

            {testResult && (
              <div className={`mt-4 p-3 rounded-md text-sm ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
