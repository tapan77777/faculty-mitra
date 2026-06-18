import Link from 'next/link';
import { logoutAction } from '../login/actions';
import { Home, Users, MessageSquare, Monitor, LogOut } from 'lucide-react';

const navLinks = [
  { href: '/admin',               label: 'Overview',      icon: <Home className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/admin/faculty',       label: 'Faculty',       icon: <Users className="w-4 h-4" strokeWidth={1.5} /> },
  { href: '/admin/conversations', label: 'Conversations', icon: <MessageSquare className="w-4 h-4" strokeWidth={1.5} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F6F9FC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white flex flex-col border-r border-[#E3E8EE]">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#E3E8EE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center flex-shrink-0">
              <Monitor className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A2540] leading-tight">FacultyMitra</p>
              <p className="text-xs text-[#8898AA]">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#425466] hover:bg-[#F6F9FC] hover:text-[#0A2540] transition-colors text-sm font-medium group"
            >
              <span className="text-[#8898AA] group-hover:text-[#635BFF] transition-colors">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#E3E8EE]">
          <form action={logoutAction}>
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-[#E3E8EE] flex-shrink-0">
          <h1 className="text-sm font-semibold text-[#0A2540] tracking-wide">FacultyMitra Admin</h1>
          <span className="text-xs text-[#8898AA] bg-[#F6F9FC] border border-[#E3E8EE] px-2.5 py-1 rounded-full">Live Dashboard</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
