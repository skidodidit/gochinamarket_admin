import AdminNavbar from '@/components/AdminNavbar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <AdminNavbar />
      <main className="p-6">{children}</main> */}
      <div className="min-h-screen bg-gray-50 text-black">
      <AdminNavbar />
      <div className="lg:ml-64">
        <AdminHeader userName="John Doe" userRole="Super Admin" />
        <main className="p-6 overflow-y-auto pt-32 pr-12">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}
