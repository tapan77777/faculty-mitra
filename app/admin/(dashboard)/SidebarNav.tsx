'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, MessageSquare } from 'lucide-react';

const navLinks = [
  { href: '/admin',               label: 'Overview',      icon: Home },
  { href: '/admin/faculty',       label: 'Faculty',       icon: Users },
  { href: '/admin/conversations', label: 'Conversations', icon: MessageSquare },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border-l-4 ${
              active
                ? 'bg-[#F5F7FF] border-[#635BFF] text-[#0A2540] font-semibold'
                : 'border-transparent text-[#425466] hover:bg-[#F9FAFB] hover:text-[#0A2540]'
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
