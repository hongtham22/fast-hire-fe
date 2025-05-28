"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import SidebarHR from "../layout/sidebarHR";



export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['hr']}>
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <SidebarHR/>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
