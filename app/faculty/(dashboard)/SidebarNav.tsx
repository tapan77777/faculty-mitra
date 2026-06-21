'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Pencil, BookOpen, Clock } from 'lucide-react';

const navLinks = [
  { href: '/faculty/dashboard', label: 'Dashboard', icon: Home },
  { href: '/faculty/audit',     label: 'Audit',     icon: ClipboardList },
  { href: '/faculty/assign',    label: 'Assign',    icon: Pencil },
  { href: '/faculty/topic',     label: 'Topic',     icon: BookOpen },
  { href: '/faculty/history',   label: 'History',   icon: Clock },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 border-l-4 ${
              active
                ? 'bg-[#F5F7FF] border-[#635BFF] text-[#0A2540] font-semibold'
                : 'border-transparent text-[#425466] font-normal hover:bg-[#F9FAFB] hover:text-[#0A2540]'
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#635BFF]' : 'text-[#6B7280]'}`}
              strokeWidth={1.5}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t border-[#E3E8EE] fixed bottom-0 left-0 right-0 flex md:hidden z-50">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors duration-200 ${
              active ? 'text-[#635BFF]' : 'text-[#8898AA] hover:text-[#635BFF]'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
            <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
