/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import HRUserTable from '@/components/admin/HRManagement/HRUserTable';
import HRUserForm from '@/components/admin/HRManagement/HRUserForm';
import PasswordChangeForm from '@/components/admin/HRManagement/PasswordChangeForm';
import { getAllUsers, createHRUser, updateHRUser, deleteHRUser, changeHRUserPassword, type HRUser } from '@/lib/api';

// Update interface to match API response
interface DisplayHRUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr';
  status: 'active' | 'inactive';
  lastActive: string;
}

export default function HRManagementPage() {
  const [users, setUsers] = useState<DisplayHRUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<DisplayHRUser | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPasswordUser, setChangingPasswordUser] = useState<DisplayHRUser | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert API HRUser to DisplayHRUser
  const convertToDisplayUser = (user: HRUser): DisplayHRUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.isEmailVerified ? 'active' : 'inactive',
    lastActive: new Date(user.createdAt).toLocaleString(),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getAllUsers();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        // Filter only HR users and convert to display format
        const hrUsers = result.data
          .filter(user => user.role === 'hr')
          .map(convertToDisplayUser);
        setUsers(hrUsers);
      }
    } catch (error) {
      console.error('Error fetching HR users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch HR users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      setError(null);
      
      const result = await createHRUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        const newDisplayUser = convertToDisplayUser(result.data);
        setUsers((prev) => [...prev, newDisplayUser]);
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error creating HR user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create HR user');
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setShowForm(true);
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (editingUser) {
      try {
        setError(null);
        
        const result = await updateHRUser(editingUser.id, {
          name: data.name,
          email: data.email,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          const updatedDisplayUser = convertToDisplayUser(result.data);
          setUsers((prev) =>
            prev.map((user) =>
              user.id === editingUser.id ? updatedDisplayUser : user
            )
          );
        }
        
        setShowForm(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Error updating HR user:', error);
        setError(error instanceof Error ? error.message : 'Failed to update HR user');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        
        const result = await deleteHRUser(userId);
        
        if (result.error) {
          throw new Error(result.error);
        }

        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting HR user:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete HR user');
      }
    }
  };

  const handleChangePassword = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setChangingPasswordUser(user);
      setShowPasswordForm(true);
    }
  };

  const handlePasswordChange = async (passwordData: { newPassword: string; confirmPassword: string }) => {
    if (changingPasswordUser) {
      try {
        setError(null);
        setIsChangingPassword(true);
        
        const result = await changeHRUserPassword(changingPasswordUser.id, passwordData);

        if (result.error) {
          throw new Error(result.error);
        }

        // Show success message (you could add a success state here)
        alert('Password changed successfully!');
        
        setShowPasswordForm(false);
        setChangingPasswordUser(null);
      } catch (error) {
        console.error('Error changing password:', error);
        setError(error instanceof Error ? error.message : 'Failed to change password');
      } finally {
        setIsChangingPassword(false);
      }
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

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <HRUserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onChangePassword={handleChangePassword}
      />

      {showForm && (
        <HRUserForm
          initialData={editingUser ? {
            name: editingUser.name,
            email: editingUser.email,
          } : undefined}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          isEditing={!!editingUser}
        />
      )}

      {showPasswordForm && changingPasswordUser && (
        <PasswordChangeForm
          userName={changingPasswordUser.name}
          onSubmit={handlePasswordChange}
          onCancel={() => {
            setShowPasswordForm(false);
            setChangingPasswordUser(null);
            setError(null);
          }}
          isLoading={isChangingPassword}
        />
      )}
    </div>
  );
} 