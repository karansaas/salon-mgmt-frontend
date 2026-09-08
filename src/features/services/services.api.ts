import { api } from '../../lib/api';
import type { Service, ServiceInput, ServiceListResponse, ServicePerformance } from './types';
export const getServices = async (params: { page: number; search: string; category: string; status: string }): Promise<ServiceListResponse> => (await api.get<ServiceListResponse>('/services', { params: { ...params, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', category: params.category || undefined } })).data;
export const getService = async (id: string): Promise<Service> => (await api.get<{ service: Service }>(`/services/${id}`)).data.service;
export const getServicePerformance = async (id: string): Promise<ServicePerformance> => (await api.get<{ performance: ServicePerformance }>(`/services/${id}/performance`)).data.performance;
export const createService = async (payload: ServiceInput): Promise<Service> => (await api.post<{ service: Service }>('/services', payload)).data.service;
export const updateService = async ({ id, payload }: { id: string; payload: ServiceInput }): Promise<Service> => (await api.put<{ service: Service }>(`/services/${id}`, payload)).data.service;
export const deleteService = async (id: string): Promise<void> => { await api.delete(`/services/${id}`); };
