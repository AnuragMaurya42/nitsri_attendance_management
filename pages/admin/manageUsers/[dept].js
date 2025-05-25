import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ManageUsers() {
  const router = useRouter();
  const { dept } = router.query;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-200">
        <h1 className="text-2xl font-extrabold text-green-700 mb-8">
          Manage Users
        </h1>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-center justify-center">
          <Link href={{ pathname: "/admin/managefaculties", query: { dept } }}>
            <button className="px-6 py-3 w-52 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all duration-200">
              Manage Faculties
            </button>
          </Link>
          <Link href="/admin/managestudents">
            <button className="px-6 py-3 w-52 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition-all duration-200">
              Manage Students
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
