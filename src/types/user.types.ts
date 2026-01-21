/**
 * MTB Credit Card Application - User DTOs
 */

/**
 * User role in the system
 */
export type UserRole = 'APPLICANT' | 'STAFF' | 'ADMIN' | 'RM' | 'BRANCH_MANAGER';

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
export interface StaffUser {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  branch: string;
  role: 'RM' | 'BRANCH_MANAGER' | 'ADMIN';
}

/**
 * Session information (for applicants)
 */
export interface UserSession {
  userId: string;
  role: UserRole;
  isAuthenticated: boolean;
  expiresAt: string;
}

/**
 * Full session with user (for backward compatibility)
 */
export interface FullUserSession {
  user: User;
  sessionId: string;
  expiresAt: string;
  isAuthenticated: boolean;
}
