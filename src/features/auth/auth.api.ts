import { api } from '../../lib/api';
import type { LoginResponse, User } from '../../types/auth';

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> =>
  (await api.post<LoginResponse>('/auth/login', { email, password })).data;
export const getMe = async (): Promise<User> => (await api.get<{ user: User }>('/auth/me')).data.user;
export const logoutRequest = async (): Promise<void> => { await api.post('/auth/logout'); };
