"use client";

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import HRUserTable from '@/components/admin/HRManagement/HRUserTable';
import HRUserForm from '@/components/admin/HRManagement/HRUserForm';

interface HRUser {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export default function HRManagementPage() {
  const [users, setUsers] = useState<HRUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<HRUser | null>(null);

  useEffect(() => {
    // Simulate fetching HR users
    const fetchUsers = async () => {
      try {
        // Replace with actual API call
        const mockUsers: HRUser[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            department: 'IT',
            status: 'active',
            lastActive: '2024-03-20 10:30',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            department: 'HR',
            status: 'active',
            lastActive: '2024-03-20 09:15',
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching HR users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = (data: any) => {
    // Replace with actual API call
    const newUser: HRUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      department: data.department,
      status: 'active',
      lastActive: new Date().toLocaleString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setShowForm(false);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setShowForm(true);
    }
  };

  const handleUpdateUser = (data: any) => {
    if (editingUser) {
      // Replace with actual API call
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: data.name,
                email: data.email,
                department: data.department,
              }
            : user
        )
      );
      setShowForm(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Replace with actual API call
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">HR Management</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add HR User
        </button>
      </div>

      <HRUserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {showForm && (
        <HRUserForm
          initialData={editingUser ? {
            name: editingUser.name,
            email: editingUser.email,
            department: editingUser.department,
          } : undefined}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          isEditing={!!editingUser}
        />
      )}
    </div>
  );
} 