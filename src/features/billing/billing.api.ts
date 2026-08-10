import { api } from '../../lib/api'; import type { Bill, BillListResponse, BillRequest } from './types';
export const createBill = async (data: BillRequest): Promise<Bill> => (await api.post<{ bill: Bill }>('/bills', data)).data.bill;
export const getBills = async (params: { page: number; search: string; paymentStatus: string; from: string; to: string; sortBy: string; sortOrder: string }): Promise<BillListResponse> => (await api.get<BillListResponse>('/bills', { params: { ...params, paymentStatus: params.paymentStatus || undefined, from: params.from || undefined, to: params.to || undefined } })).data;
export const getBill = async (id: string): Promise<Bill> => (await api.get<{ bill: Bill }>(`/bills/${id}`)).data.bill;
