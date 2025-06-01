"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { updateOwnProfile, changeOwnPassword } from "@/lib/api";

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (profileError) {
      setProfileError(null);
    }
    if (profileSuccess) {
      setProfileSuccess(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      setProfileError("Name is required");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      setProfileError(null);
      
      const result = await updateOwnProfile({
        name: profileData.name.trim(),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        // Update user in context
        updateUser(result.data);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (passwordError) {
      setPasswordError(null);
    }
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 5) {
      errors.newPassword = 'Password must be at least 5 characters long';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword && passwordData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError(null);
      
      const result = await changeOwnPassword(passwordData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Reset form and show success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your HR account and preferences</p>
      </div>
      
      {/* Profile Settings */}
      <div className="rounded-xl border shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-3">
          <h2 className="font-medium">Account Settings</h2>
        </div>
        
        <form onSubmit={handleProfileSubmit} className="p-6">
          {profileError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {profileError}
            </div>
          )}
          
          {profileSuccess && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={isUpdatingProfile}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                readOnly
                title="Email cannot be changed"
              />
              <p className="mt-1 text-xs text-gray-500">Email address cannot be modified</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="role" className="mb-1 block text-sm font-medium">
              Role
            </label>
            <input
              type="text"
              id="role"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
              value={user?.role === 'hr' ? 'Human Resources' : user?.role || 'Human Resources'}
              readOnly
            />
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={isUpdatingProfile}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Password Settings */}
      <div className="rounded-xl border shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-3">
          <h2 className="font-medium">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit} className="p-6">
          {passwordError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Password changed successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="mb-1 block text-sm font-medium">
                Current Password*
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="current-password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={isChangingPassword}
                  className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 pr-10 ${
                    passwordErrors.currentPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isChangingPassword}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                New Password*
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="new-password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isChangingPassword}
                  className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 pr-10 ${
                    passwordErrors.newPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isChangingPassword}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
              {!passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 5 characters long
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                Confirm New Password*
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirm-password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isChangingPassword}
                  className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 pr-10 ${
                    passwordErrors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isChangingPassword}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 