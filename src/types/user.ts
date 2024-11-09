export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  createdAt: string;
  establishmentId?: string; // Only for ADMIN role
}