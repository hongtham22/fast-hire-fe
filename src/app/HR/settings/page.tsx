"use client";

import { Save } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your HR account and preferences</p>
      </div>
      
      <div className="rounded-xl border shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-3">
          <h2 className="font-medium">Account Settings</h2>
        </div>
        
        <div className="divide-y">
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                defaultValue={user?.name || "HR Manager"}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                defaultValue={user?.email || "hr@company.com"}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium">
                Role
              </label>
              <input
                type="text"
                id="role"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                defaultValue={user?.role === 'hr' ? 'Human Resources' : user?.role || 'Human Resources'}
                readOnly
              />
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="mb-4 text-sm font-medium">Password</h3>
            
            <div className="mb-4">
              <label htmlFor="current-password" className="mb-1 block text-sm font-medium">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-3">
          <h2 className="font-medium">Notification Preferences</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">New Applications</h3>
                <p className="text-sm text-gray-500">Get notified when a new candidate applies</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Interview Reminders</h3>
                <p className="text-sm text-gray-500">Receive reminders for upcoming interviews</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI Matching Alerts</h3>
                <p className="text-sm text-gray-500">Get alerts for high-match candidates</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
} 