/**
 * MTB Credit Card Application - User DTOs
 */

/**
 * User role in the system
 */
export type UserRole = 'APPLICANT' | 'STAFF' | 'ADMIN';

/**
 * Authenticated user information
 */
export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  avatarUrl?: string;
}

/**
 * Staff user for assisted mode
 */
export interface StaffUser extends User {
  role: 'STAFF';
  employeeId: string;
  branch: string;
  department: string;
}

/**
 * Session information
 */
export interface UserSession {
  user: User;
  sessionId: string;
  expiresAt: string;
  isAuthenticated: boolean;
}
