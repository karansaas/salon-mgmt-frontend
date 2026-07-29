export type UserRole = 'Admin' | 'Staff';
export interface User { id: string; name: string; email: string; role: UserRole; isActive: boolean; }
export interface LoginResponse { user: User; }
