'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/fields', label: 'Quản Lý Sân Bóng', icon: '⚽' },
    { href: '/admin/users', label: 'Quản Lý Người Dùng', icon: '👥' },
    { href: '/admin/staffs', label: 'Quản Lý Nhân Viên', icon: '👨‍💼' },
    { href: '/admin/bookings', label: 'Quản Lý Đặt Sân', icon: '📅' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>⚽ Admin Panel</h2>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

