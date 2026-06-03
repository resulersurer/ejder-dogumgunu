import prisma from '@/lib/prisma';
import { getNowInTurkey, isBirthdayToday } from '@/lib/date';
import { Cake, Users, Send } from 'lucide-react';

export default async function DashboardPage() {
  const [employeeCount, logCount, recentLogs, allEmployees] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.birthdayEmailLog.count({ where: { status: 'SENT' } }),
    prisma.birthdayEmailLog.findMany({
      take: 5,
      orderBy: { sentAt: 'desc' },
      include: { employee: true },
    }),
    prisma.employee.findMany({ where: { isActive: true } }),
  ]);

  const todayBirthdays = allEmployees.filter(emp => isBirthdayToday(emp.birthDate));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Aktif Personel</p>
            <p className="text-2xl font-bold text-gray-900">{employeeCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-lg mr-4">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bugün Doğum Günü</p>
            <p className="text-2xl font-bold text-gray-900">{todayBirthdays.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gönderilen Mail</p>
            <p className="text-2xl font-bold text-gray-900">{logCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bugün Doğum Günü Olanlar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Bugün Doğum Günü Olanlar</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {todayBirthdays.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Bugün doğum günü olan personel bulunmuyor.</div>
            ) : (
              todayBirthdays.map(emp => (
                <div key={emp.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                    <p className="text-sm text-gray-500">{emp.department || 'Departman Belirtilmemiş'}</p>
                  </div>
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full">
                    Bugün
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Son Gönderilen Mailler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Son Gönderilen Mailler</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Henüz mail gönderilmemiş.</div>
            ) : (
              recentLogs.map(log => (
                <div key={log.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{log.employee.firstName} {log.employee.lastName}</p>
                    <p className="text-sm text-gray-500">{new Date(log.sentAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    log.status === 'SENT' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {log.status === 'SENT' ? 'Başarılı' : 'Hata'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
