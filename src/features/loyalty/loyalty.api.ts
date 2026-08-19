import { api } from '../../lib/api';
import type { ClientLoyaltyResponse, LoyaltyAdjustmentInput, LoyaltyConfig } from './types';

export const getClientLoyalty = async (clientId: string, page = 1): Promise<ClientLoyaltyResponse> =>
  (await api.get<ClientLoyaltyResponse>(`/clients/${clientId}/loyalty`, { params: { page, limit: 20 } })).data;

export const adjustClientLoyalty = async ({ clientId, ...payload }: LoyaltyAdjustmentInput & { clientId: string }) =>
  (await api.post<{ account: ClientLoyaltyResponse['account'] }>(`/clients/${clientId}/loyalty/adjustments`, payload)).data.account;

export const getLoyaltyConfig = async (): Promise<LoyaltyConfig> => (await api.get<{ config: LoyaltyConfig }>('/loyalty/config')).data.config;
export const updateLoyaltyConfig = async (config: LoyaltyConfig): Promise<LoyaltyConfig> => (await api.put<{ config: LoyaltyConfig }>('/loyalty/config', config)).data.config;
