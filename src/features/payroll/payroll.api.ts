import { api } from '../../lib/api';
import type { PayrollRecord, PayrollResponse } from './types';

export const getPayroll = async (cycle: string): Promise<PayrollResponse> => (await api.get<PayrollResponse>('/payroll', { params: { cycle } })).data;
export const generatePayroll = async (cycle: string): Promise<PayrollResponse> => (await api.post<PayrollResponse>('/payroll/generate', { cycle })).data;
export const releasePayroll = async (id: string): Promise<PayrollRecord> => (await api.post<{ payroll: PayrollRecord }>(`/payroll/${id}/release`)).data.payroll;
