import { api } from '../../lib/api';
import type { Client, ClientHistory, ClientInput, ClientListResponse } from './types';

export const getClients = async (params: { page: number; search: string }): Promise<ClientListResponse> =>
  (await api.get<ClientListResponse>('/clients', { params: { ...params, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' } })).data;

export const getClient = async (id: string): Promise<Client> => (await api.get<{ client: Client }>(`/clients/${id}`)).data.client;
export const getClientHistory = async (id: string): Promise<ClientHistory> => (await api.get<ClientHistory>(`/clients/${id}/history`)).data;
export const createClient = async (payload: ClientInput): Promise<Client> => (await api.post<{ client: Client }>('/clients', payload)).data.client;
export const updateClient = async ({ id, payload }: { id: string; payload: ClientInput }): Promise<Client> => (await api.put<{ client: Client }>(`/clients/${id}`, payload)).data.client;
export const deleteClient = async (id: string): Promise<void> => { await api.delete(`/clients/${id}`); };
