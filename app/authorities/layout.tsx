'use client';

import Sidebar from '../components/layout/Sidebar';
import { usePathname } from 'next/navigation';

export default function AuthoritiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMapPage = pathname === '/authorities/map';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className={`flex-1 bg-gray-50 ${isMapPage ? 'overflow-hidden h-full' : 'overflow-auto'}`}>
        {children}
      </main>
    </div>
  );
}
