import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditEmployeePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const employee = await prisma.employee.findUnique({ where: { id } });

  if (!employee) {
    notFound();
  }

  async function updateEmployee(formData: FormData) {
    'use server';
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const department = formData.get('department') as string;
    const birthDateStr = formData.get('birthDate') as string;
    const isActive = formData.get('isActive') === 'on';

    if (!firstName || !lastName || !email || !birthDateStr) {
      throw new Error('Lütfen zorunlu alanları doldurun.');
    }

    const birthDate = new Date(birthDateStr);

    await prisma.employee.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        department,
        birthDate,
        isActive,
      },
    });

    redirect('/admin/employees');
  }

  // YYYY-MM-DD format for input date
  const formattedDate = employee.birthDate.toISOString().split('T')[0];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/employees" className="mr-4 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Personel Düzenle</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form action={updateEmployee} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Ad</label>
              <input type="text" name="firstName" id="firstName" defaultValue={employee.firstName} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Soyad</label>
              <input type="text" name="lastName" id="lastName" defaultValue={employee.lastName} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input type="email" name="email" id="email" defaultValue={employee.email} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departman</label>
              <input type="text" name="department" id="department" defaultValue={employee.department || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
              <input type="date" name="birthDate" id="birthDate" defaultValue={formattedDate} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked={employee.isActive} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isActive" className="font-medium text-gray-700">Aktif Çalışan</label>
              <p className="text-gray-500">Pasif çalışanlara doğum günü maili gönderilmez.</p>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end">
            <Link href="/admin/employees" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
              İptal
            </Link>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
