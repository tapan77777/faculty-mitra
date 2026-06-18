import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import { facultyLogoutAction } from '../login/actions';
import { Home, ClipboardList, Pencil, BookOpen, Clock, LogOut } from 'lucide-react';

const navLinks = [
  { href: '/faculty/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/faculty/audit',     label: 'Audit',     icon: <ClipboardList className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/faculty/assign',    label: 'Assign',    icon: <Pencil className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/faculty/topic',     label: 'Topic',     icon: <BookOpen className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/faculty/history',   label: 'History',   icon: <Clock className="w-4 h-4" strokeWidth={1.5} /> },
];

export default async function FacultyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  return (
    <div className="bg-[#F6F9FC] min-h-screen">
      {/* Sidebar — desktop only */}
      <aside className="bg-white border-r border-[#E3E8EE] w-64 hidden md:flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo area */}
        <div className="px-6 py-5 border-b border-[#E3E8EE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#0A2540] font-bold text-lg leading-tight">FacultyMitra</p>
              <p className="text-[#8898AA] text-xs">Faculty Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#425466] text-sm hover:bg-[#F6F9FC] hover:text-[#0A2540] transition-colors font-medium group"
            >
              <span className="text-[#8898AA] group-hover:text-[#635BFF] transition-colors">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="px-3 py-4 border-t border-[#E3E8EE]">
          {faculty && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-semibold text-[#0A2540] truncate">{faculty.name}</p>
              {faculty.college && <p className="text-xs text-[#8898AA] truncate mt-0.5">{faculty.college}</p>}
              {faculty.designation && <p className="text-xs text-[#8898AA] truncate">{faculty.designation}</p>}
            </div>
          )}
          <form action={facultyLogoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#425466] hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="md:ml-64 bg-[#F6F9FC] min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-[#E3E8EE]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold text-[#0A2540]">FacultyMitra</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-[#0A2540]">{faculty?.name ?? 'Faculty'}</p>
            <form action={facultyLogoutAction}>
              <button
                type="submit"
                className="p-1.5 rounded-lg text-[#8898AA] hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="bg-white border-t border-[#E3E8EE] fixed bottom-0 left-0 right-0 flex md:hidden z-50">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[#8898AA] hover:text-[#635BFF] transition-colors"
          >
            <span>{link.icon}</span>
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
