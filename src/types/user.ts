/**
 * HR User interface
 */
export interface HRUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr';
  isActive: boolean;
  createdAt: string;
}

/**
 * Display interface for HR users in table components
 */
export interface DisplayHRUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr';
  status: 'active' | 'inactive';
  lastActive: string;
}

/**
 * Form data interface for HR user forms
 */
export interface HRUserFormData {
  name: string;
  email: string;
  password?: string;
}

/**
 * Data for creating a new HR user
 */
export interface CreateHRUserData {
  name: string;
  email: string;
  password: string;
}

/**
 * Data for updating HR user profile
 */
export interface UpdateHRUserData {
  name?: string;
  email?: string;
}

/**
 * Data for password reset form (admin action)
 */
export interface PasswordResetFormData {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Data for changing HR user password (admin action)
 */
export interface ChangeHRPasswordData {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Data for changing own password (user action)
 */
export interface ChangeOwnPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 