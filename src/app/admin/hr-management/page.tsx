"use client";

import { useEffect, useState } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import HRUserTable from "@/components/admin/HRManagement/HRUserTable";
import HRUserForm from "@/components/admin/HRManagement/HRUserForm";
import PasswordResetForm from "@/components/admin/HRManagement/PasswordResetForm";
import {
  getAllUsers,
  createHRUser,
  updateHRUser,
  deactivateHRUser,
  activateHRUser,
  resetHRUserPassword,
} from "@/lib/api";
import {
  HRUser,
  DisplayHRUser,
  HRUserFormData,
} from "@/types/user";

export default function HRManagementPage() {
  const [users, setUsers] = useState<HRUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HRUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await getAllUsers(true); // Include inactive users

      if (error) {
        setError(error);
      } else {
        setUsers(data || []);
      }
    } catch {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: HRUserFormData) => {
    // Ensure password is provided for create
    if (!userData.password) {
      alert("Password is required");
      return;
    }

    try {
      const { error } = await createHRUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        alert(`Error: ${error}`);
      } else {
        setIsCreateModalOpen(false);
        fetchUsers(); // Refresh the user list
        alert("HR user created successfully!");
      }
    } catch {
      alert("Failed to create HR user");
    }
  };

  const handleEditUser = async (userData: HRUserFormData) => {
    if (!selectedUser) return;

    try {
      const { error } = await updateHRUser(selectedUser.id, {
        name: userData.name,
        email: userData.email,
      });

      if (error) {
        alert(`Error: ${error}`);
      } else {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the user list
        alert("HR user updated successfully!");
      }
    } catch {
      alert("Failed to update HR user");
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this HR user? They will not be able to access the system.")) {
      return;
    }

    try {
      const { error } = await deactivateHRUser(userId);

      if (error) {
        alert(`Error: ${error}`);
      } else {
        fetchUsers(); // Refresh the user list
        alert("HR user deactivated successfully!");
      }
    } catch {
      alert("Failed to deactivate HR user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to activate this HR user?")) {
      return;
    }

    try {
      const { error } = await activateHRUser(userId);

      if (error) {
        alert(`Error: ${error}`);
      } else {
        fetchUsers(); // Refresh the user list
        alert("HR user activated successfully!");
      }
    } catch {
      alert("Failed to activate HR user");
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await resetHRUserPassword(selectedUser.id, "hr123");

      if (error) {
        alert(`Error: ${error}`);
      } else {
        setIsPasswordModalOpen(false);
        setSelectedUser(null);
        alert(
          "Password reset successfully! The new password is: hr123\nPlease notify the HR user."
        );
      }
    } catch {
      alert("Failed to reset password");
    }
  };

  const openEditModal = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const openPasswordModal = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsPasswordModalOpen(true);
    }
  };

  // Transform API HRUser data to DisplayHRUser format for the table
  const transformUsersForDisplay = (apiUsers: HRUser[]): DisplayHRUser[] => {
    return apiUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.isActive ? "active" : "inactive",
      lastActive: new Date(user.createdAt).toLocaleDateString(),
    }));
  };

  // Filter users based on search query
  const filteredUsers = transformUsersForDisplay(users).filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Management</h1>
          <p className="text-gray-600">Manage HR users and their permissions</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add HR User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search HR users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* HR Users Table */}
      <HRUserTable
        users={filteredUsers}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDeactivateUser}
        onActivate={handleActivateUser}
        onChangePassword={openPasswordModal}
      />

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Create New HR User
                </h3>
              </div>
              <div className="p-6">
                <HRUserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setIsEditModalOpen(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit HR User
                </h3>
              </div>
              <div className="p-6">
                <HRUserForm
                  initialData={{
                    name: selectedUser.name,
                    email: selectedUser.email,
                    password: "", // Don't pre-fill password for editing
                  }}
                  onSubmit={handleEditUser}
                  onCancel={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  isEditing={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setIsPasswordModalOpen(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Reset Password for {selectedUser.name}
                </h3>
              </div>
              <div className="p-6">
                <PasswordResetForm
                  userName={selectedUser.name}
                  onSubmit={handleResetPassword}
                  onCancel={() => {
                    setIsPasswordModalOpen(false);
                    setSelectedUser(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
