import axios from 'axios';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { InformationCard } from '../components/ui/InformationCard';
import { Pagination } from '../components/ui/Pagination';
import { getClient, getClientBills } from '../features/clients/clients.api';
import { ClientLoyaltySection } from '../features/loyalty/ClientLoyaltySection';
import { useAuth } from '../features/auth/AuthProvider';

const message = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const date = (value?: string | null) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value)) : '—';
const money = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const Detail = ({ label, value }: { label: string; value?: string | null }) => <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm text-slate-700">{value || '—'}</dd></div>;

export const ClientDetailsPage = () => {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const clientQuery = useQuery({ queryKey: ['client', id], queryFn: () => getClient(id), enabled: Boolean(id) });
  const billsQuery = useQuery({ queryKey: ['client-bills', id, page], queryFn: () => getClientBills(id, page), enabled: Boolean(id) });
  if (clientQuery.isLoading || billsQuery.isLoading) return <p className="text-sm text-slate-500">Loading client details…</p>;
  if (clientQuery.isError || billsQuery.isError || !clientQuery.data || !billsQuery.data) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{message(clientQuery.error ?? billsQuery.error)}</div>;
  const client = clientQuery.data;
  const bills = billsQuery.data;
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-sm font-medium text-brand-600">Client profile</p><h2 className="mt-1 text-2xl font-bold">{client.firstName} {client.lastName || ''}</h2></div><div className="flex gap-3">{user?.role !== 'Employee' && <Link to={`/clients/${id}/edit`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Edit Client</Link>}<Link to="/clients" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Back to clients</Link></div></div>
    <div className="grid gap-6 xl:grid-cols-3"><InformationCard title="Personal Information" className="xl:col-span-2"><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Mobile Number" value={client.mobileNumber} /><Detail label="Email" value={client.email} /><Detail label="Gender" value={client.gender} /><Detail label="Date of Birth" value={date(client.dateOfBirth)} /><Detail label="Address" value={client.address} /><Detail label="Notes" value={client.notes} /></dl></InformationCard><InformationCard title="Billing Summary"><dl className="space-y-4"><Detail label="Total Bills" value={String(bills.summary.totalBills)} /><Detail label="Total Amount Spent" value={money(bills.summary.totalAmountSpent)} /><Detail label="Last Visit" value={date(bills.summary.lastVisitDate)} /><Detail label="Last Bill" value={bills.summary.lastBillNumber} /></dl></InformationCard></div>
    <InformationCard title="Billing History">{bills.bills.length ? <><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="pb-3">Invoice</th><th className="pb-3">Date</th><th className="pb-3">Amount</th><th className="pb-3">Payment Status</th><th className="pb-3" /></tr></thead><tbody className="divide-y">{bills.bills.map((bill) => <tr key={bill.id}><td className="py-3 font-medium">{bill.invoiceNumber}</td><td className="py-3">{date(bill.date)}</td><td className="py-3">{money(bill.amount)}</td><td className="py-3">{bill.paymentStatus.replace('_', ' ')}</td><td className="py-3 text-right"><Link to={`/billing/${bill.id}`} className="font-medium text-brand-600">View</Link></td></tr>)}</tbody></table></div><div className="mt-4"><Pagination {...bills.pagination} onPageChange={setPage} /></div></> : <p className="text-sm text-slate-500">No billing history available yet.</p>}</InformationCard>
    <InformationCard title="Services History">{bills.serviceHistory.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="pb-3">Service</th><th className="pb-3">Employee</th><th className="pb-3">Date</th><th className="pb-3">Invoice</th><th className="pb-3 text-right">Amount</th></tr></thead><tbody className="divide-y">{bills.serviceHistory.map((item, index) => <tr key={`${item.billId}-${index}`}><td className="py-3 font-medium">{item.serviceName}</td><td className="py-3">{item.employeeName}</td><td className="py-3">{date(item.date)}</td><td className="py-3"><Link className="text-brand-600" to={`/billing/${item.billId}`}>{item.invoiceNumber}</Link></td><td className="py-3 text-right">{money(item.amount)}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">No services availed through billing yet.</p>}</InformationCard>
    <ClientLoyaltySection clientId={id} />
  </div>;
};
