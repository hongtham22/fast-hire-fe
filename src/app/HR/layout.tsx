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
      <div className="flex min-h-screen">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
          <SidebarHR/>
        </div>
        <div className="ml-64 p-10 flex-1">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
