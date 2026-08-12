import { api } from '../../lib/api';
import type { DashboardOverview } from './types';

export const getDashboardOverview = async (from: string, to: string): Promise<DashboardOverview> => (await api.get<DashboardOverview>('/dashboard/overview', { params: { from, to } })).data;
