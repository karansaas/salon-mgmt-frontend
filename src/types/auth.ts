export type UserRole = 'Admin' | 'Staff' | 'Employee';
export interface User { id: string; name: string; email: string; role: UserRole; employeeId?: string; isActive: boolean; }
export interface LoginResponse { user: User; }
