import React from 'react';
import Sidebar from '@/components/chat/layout/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}