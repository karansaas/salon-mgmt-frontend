import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { EmptyHistory, InformationCard } from '../components/ui/InformationCard';
import { getClient, getClientHistory } from '../features/clients/clients.api';

const apiMessage = (error: unknown): string => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const displayDate = (value?: string | null): string => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value)) : 'No visits yet';
const Detail = ({ label, value }: { label: string; value?: string | null }) => <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm text-slate-700">{value || '—'}</dd></div>;

export const ClientDetailsPage = () => {
  const { id = '' } = useParams();
  const clientQuery = useQuery({ queryKey: ['client', id], queryFn: () => getClient(id), enabled: Boolean(id) });
  const historyQuery = useQuery({ queryKey: ['client-history', id], queryFn: () => getClientHistory(id), enabled: Boolean(id) });
  if (clientQuery.isLoading || historyQuery.isLoading) return <p className="text-sm text-slate-500">Loading client details…</p>;
  if (clientQuery.isError || historyQuery.isError || !clientQuery.data || !historyQuery.data) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{clientQuery.isError ? apiMessage(clientQuery.error) : historyQuery.isError ? apiMessage(historyQuery.error) : 'Client not found'}</div>;
  const client = clientQuery.data; const history = historyQuery.data;
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-sm font-medium text-brand-600">Client profile</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{client.firstName} {client.lastName}</h2><p className="mt-1 text-sm text-slate-500">Client information and activity overview.</p></div><div className="flex gap-3"><Link to={`/clients/${id}/edit`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Edit Client</Link><Link to="/clients" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white">Back to clients</Link></div></div><div className="grid gap-6 xl:grid-cols-3"><InformationCard title="Personal Information" className="xl:col-span-2"><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Mobile Number" value={client.mobileNumber} /><Detail label="Email" value={client.email} /><Detail label="Gender" value={client.gender} /><Detail label="Date of Birth" value={displayDate(client.dateOfBirth)} /><Detail label="Address" value={client.address} /><Detail label="Notes" value={client.notes} /></dl></InformationCard><InformationCard title="Client Summary"><dl className="space-y-5"><Detail label="Total Amount Spent" value={`₹${history.totalAmountSpent.toLocaleString('en-IN')}`} /><Detail label="Last Visit" value={displayDate(history.lastVisitDate)} /><Detail label="Preferred Employee" value={history.preferredEmployee ?? 'Not set'} /></dl></InformationCard></div><div className="grid gap-6 lg:grid-cols-2"><InformationCard title="Visit History"><EmptyHistory label="visit history" /></InformationCard><InformationCard title="Billing History"><EmptyHistory label="billing history" /></InformationCard><InformationCard title="Services Availed"><EmptyHistory label="services availed" /></InformationCard><InformationCard title="Products Purchased"><EmptyHistory label="products purchased" /></InformationCard></div></div>;
};
