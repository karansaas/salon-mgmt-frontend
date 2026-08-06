import { api } from '../../lib/api'; import type { Employee, EmployeeInput, EmployeeListResponse, EmployeeProfile } from './types';
export const getEmployees = async (params: { page: number; search: string; designation: string; status: string }): Promise<EmployeeListResponse> => (await api.get<EmployeeListResponse>('/employees', { params: { ...params, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', designation: params.designation || undefined } })).data;
export const getEmployee = async (id: string): Promise<Employee> => (await api.get<{ employee: Employee }>(`/employees/${id}`)).data.employee;
export const createEmployee = async (data: EmployeeInput): Promise<Employee> => (await api.post<{ employee: Employee }>('/employees', data)).data.employee;
export const updateEmployee = async ({ id, data }: { id: string; data: EmployeeInput }): Promise<Employee> => (await api.put<{ employee: Employee }>(`/employees/${id}`, data)).data.employee;
export const deleteEmployee = async (id: string): Promise<void> => { await api.delete(`/employees/${id}`); };
export const getEmployeeProfile = async (id: string): Promise<EmployeeProfile> => (await api.get<EmployeeProfile>(`/employees/${id}/profile`)).data;
export const getAssignableServices = async () => (await api.get<{ services: { id: string; name: string; category: string }[] }>('/services', { params: { limit: 100, status: 'active', sortBy: 'name', sortOrder: 'asc' } })).data.services;
