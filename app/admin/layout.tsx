import Link from 'next/link';
import { Cake, Users, Settings, LogOut, LayoutDashboard, Send } from 'lucide-react';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Cake className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-bold text-lg">Birthday Mail</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500" />
            Dashboard
          </Link>
          <Link href="/admin/employees" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <Users className="w-5 h-5 mr-3 text-gray-500" />
            Personeller
          </Link>
          <Link href="/admin/email-logs" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <Send className="w-5 h-5 mr-3 text-gray-500" />
            Gönderim Geçmişi
          </Link>
          <Link href="/admin/settings" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3 text-gray-500" />
            Ayarlar
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form action={async () => {
            'use server';
            await logout();
            redirect('/admin/login');
          }}>
            <button type="submit" className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
