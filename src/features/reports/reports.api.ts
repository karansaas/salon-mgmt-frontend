import { api } from '../../lib/api';
export type ReportType = 'sales' | 'services' | 'products' | 'employees' | 'customers' | 'tax';
export type ReportResponse = { range: { from: string; to: string }; summary: Record<string, number>; rows: any[]; paymentMethods?: { method: string; amount: number; bills: number; percentage: number }[]; pagination?: { page: number; limit: number; total: number; totalPages: number }; };
export const getReport = async (type: ReportType, params: { from: string; to: string; page: number; search: string }): Promise<ReportResponse> => (await api.get<ReportResponse>(`/reports/${type}`, { params: { ...params, limit: 20, search: params.search || undefined } })).data;
export const exportReport = async (type: ReportType, params: { from: string; to: string; search: string }) => (await api.get(`/reports/${type}/export`, { params: { ...params, search: params.search || undefined }, responseType: 'blob' })).data as Blob;
