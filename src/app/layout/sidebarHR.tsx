"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Mail,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/HR/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "Job Postings",
    href: "/HR/job-postings",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Candidates",
    href: "/HR/candidates",
    icon: <User className="h-5 w-5" />,
  },
  // {
  //   name: "Applications",
  //   href: "/HR/applications",
  //   icon: <FolderOpen className="h-5 w-5" />,
  // },
  {
    name: "Email Templates",
    href: "/HR/email-templates",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/HR/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function SidebarHR() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/HR/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-xl">FastHire</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">HR</span>
        </Link>
      </div>
      <nav className="flex-1 py-4">
        <ul className="grid gap-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t">
        <div className="flex items-center gap-3 p-4">
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || 'user'}</span>
            <span className="text-xs text-gray-500">{user?.email || 'email'}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
} 