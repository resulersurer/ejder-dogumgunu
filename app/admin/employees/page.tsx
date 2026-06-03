import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { revalidatePath } from 'next/cache';

export default async function EmployeesPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const status = searchParams?.status || 'all';

  const whereClause: any = {};
  
  if (query) {
    whereClause.OR = [
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (status === 'active') whereClause.isActive = true;
  if (status === 'inactive') whereClause.isActive = false;

  const employees = await prisma.employee.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  async function deleteEmployee(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.employee.delete({ where: { id } });
    revalidatePath('/admin/employees');
  }

  async function toggleStatus(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentStatus = formData.get('isActive') === 'true';
    await prisma.employee.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/employees');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Personel Listesi</h1>
        <Link 
          href="/admin/employees/new" 
          className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Personel Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form className="relative w-full sm:max-w-md flex" method="GET">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="İsim, e-posta ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {status !== 'all' && <input type="hidden" name="status" value={status} />}
            <button type="submit" className="ml-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Ara
            </button>
          </form>

          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="?status=all" className={`px-3 py-1.5 text-sm font-medium rounded-md ${status === 'all' ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>Tümü</Link>
            <Link href="?status=active" className={`px-3 py-1.5 text-sm font-medium rounded-md ${status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>Aktif</Link>
            <Link href="?status=inactive" className={`px-3 py-1.5 text-sm font-medium rounded-md ${status === 'inactive' ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>Pasif</Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departman</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doğum Tarihi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                employees.map((employee: any) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(employee.birthDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form action={toggleStatus}>
                        <input type="hidden" name="id" value={employee.id} />
                        <input type="hidden" name="isActive" value={employee.isActive.toString()} />
                        <button type="submit" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.isActive ? 'Aktif' : 'Pasif'}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link href={`/admin/employees/${employee.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={deleteEmployee}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button type="submit" className="text-red-600 hover:text-red-900" onClick={(e) => {
                            if(!confirm('Silmek istediğinize emin misiniz?')) e.preventDefault();
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
