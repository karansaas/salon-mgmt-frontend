import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Pagination } from '../components/ui/Pagination';
import { SearchBar } from '../components/ui/SearchBar';
import { ClientTable } from '../features/clients/ClientTable';
import { deleteClient, getClients } from '../features/clients/clients.api';
import type { Client } from '../features/clients/types';

const apiMessage = (error: unknown): string => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';

export const ClientsPage = () => {
  const [searchInput, setSearchInput] = useState(''); const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)?.message;
  const queryClient = useQueryClient();
  const clientsQuery = useQuery({ queryKey: ['clients', { page, search }], queryFn: () => getClients({ page, search }) });
  const deleteMutation = useMutation({ mutationFn: deleteClient, onSuccess: async () => { setSelectedClient(null); await queryClient.invalidateQueries({ queryKey: ['clients'] }); } });
  const submitSearch = (value: string) => { setSearchInput(value); setSearch(value); setPage(1); };
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Clients</h2><p className="mt-1 text-sm text-slate-500">Manage your salon client records.</p></div><Link to="/clients/new" className="inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Add Client</Link></div>{successMessage && <div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{successMessage}</div>}<SearchBar value={searchInput} onChange={submitSearch} placeholder="Search by name or mobile number" />{clientsQuery.isLoading ? <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading clients…</div> : clientsQuery.isError ? <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{apiMessage(clientsQuery.error)}</div> : clientsQuery.data?.clients.length ? <><ClientTable clients={clientsQuery.data.clients} onDelete={setSelectedClient} /><Pagination {...clientsQuery.data.pagination} onPageChange={setPage} /></> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-medium text-slate-800">No clients found</p><p className="mt-1 text-sm text-slate-500">{search ? 'Try a different search term.' : 'Add your first client to get started.'}</p></div>}<ConfirmationModal open={Boolean(selectedClient)} title="Delete client?" confirmLabel="Delete client" isConfirming={deleteMutation.isPending} onClose={() => setSelectedClient(null)} onConfirm={() => selectedClient && deleteMutation.mutate(selectedClient.id)}><p><strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong> will be deactivated and hidden from the active client list.</p>{deleteMutation.isError && <p className="mt-3 text-red-600">{apiMessage(deleteMutation.error)}</p>}</ConfirmationModal></div>;
};
