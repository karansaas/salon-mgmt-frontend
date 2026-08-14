import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { InformationCard } from '../../components/ui/InformationCard';
import { Pagination } from '../../components/ui/Pagination';
import { useAuth } from '../auth/AuthProvider';
import { adjustClientLoyalty, getClientLoyalty } from './loyalty.api';
import type { LoyaltyTransaction } from './types';

const adjustmentSchema = z.object({ points: z.coerce.number().int('Points must be a whole number').refine((value) => value !== 0, 'Points cannot be zero'), reason: z.string().trim().min(3, 'Enter a reason of at least 3 characters').max(300, 'Reason must be 300 characters or fewer') });
type AdjustmentValues = z.infer<typeof adjustmentSchema>;
const errorMessage = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const typeLabel = (type: LoyaltyTransaction['type']) => type === 'EARN' ? 'Earned' : type === 'REDEEM' ? 'Redeemed' : 'Adjustment';

export const ClientLoyaltySection = ({ clientId }: { clientId: string }) => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [success, setSuccess] = useState('');
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['client-loyalty', clientId, page], queryFn: () => getClientLoyalty(clientId, page), enabled: Boolean(clientId) });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustmentValues>({ resolver: zodResolver(adjustmentSchema), defaultValues: { points: 0, reason: '' } });
  const adjustment = useMutation({
    mutationFn: (values: AdjustmentValues) => adjustClientLoyalty({ clientId, ...values }),
    onSuccess: async () => { setSuccess('Loyalty points adjusted successfully.'); setIsAdjusting(false); reset(); await queryClient.invalidateQueries({ queryKey: ['client-loyalty', clientId] }); },
  });

  if (query.isLoading) return <InformationCard title="Loyalty"><p className="text-sm text-slate-500">Loading loyalty information…</p></InformationCard>;
  if (query.isError) return <InformationCard title="Loyalty"><p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage(query.error)}</p></InformationCard>;
  if (!query.data) return null;
  const { account, config, transactions, pagination } = query.data;
  const submit = (values: AdjustmentValues) => { setSuccess(''); adjustment.mutate({ ...values, reason: values.reason.trim() }); };

  return <section className="space-y-6">
    <InformationCard title="Loyalty"><div className="flex flex-col gap-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Current points" value={account.pointsBalance} emphasis /><Stat label="Lifetime earned" value={account.lifetimeEarned} /><Stat label="Lifetime redeemed" value={account.lifetimeRedeemed} /><Stat label="Manual adjustments" value={account.totalAdjusted} signed /></div><div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center"><p className="text-sm text-slate-500">{config.spendPerPoint} eligible spend = 1 point. {config.redemptionPoints} points = ₹{config.redemptionValue.toLocaleString('en-IN')}.</p>{user?.role === 'Admin' && <button onClick={() => { setSuccess(''); setIsAdjusting(true); }} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Adjust Points</button>}</div>{success && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</p>}</div></InformationCard>
    <InformationCard title="Loyalty Transaction History">{transactions.length ? <><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="pb-3">Type</th><th className="pb-3">Points</th><th className="pb-3">Balance</th><th className="pb-3">Reason</th><th className="pb-3">Invoice</th><th className="pb-3">Date</th><th className="pb-3">By</th></tr></thead><tbody className="divide-y">{transactions.map((transaction) => <tr key={transaction.id}><td className="py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.type === 'EARN' ? 'bg-emerald-50 text-emerald-700' : transaction.type === 'REDEEM' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{typeLabel(transaction.type)}</span></td><td className={`py-3 font-semibold ${transaction.points > 0 ? 'text-emerald-700' : 'text-red-700'}`}>{transaction.points > 0 ? '+' : ''}{transaction.points}</td><td className="py-3">{transaction.balanceAfter}</td><td className="max-w-xs py-3 text-slate-600">{transaction.reason}</td><td className="py-3">{transaction.billId && transaction.invoiceNumber ? <Link to={`/billing/${transaction.billId}`} className="font-medium text-brand-600 hover:text-brand-700">{transaction.invoiceNumber}</Link> : '—'}</td><td className="whitespace-nowrap py-3 text-slate-600">{dateTime(transaction.createdAt)}</td><td className="py-3 text-slate-600">{transaction.createdBy || '—'}</td></tr>)}</tbody></table></div><div className="mt-4"><Pagination {...pagination} onPageChange={setPage} /></div></> : <p className="text-sm text-slate-500">No loyalty activity is available for this client yet.</p>}</InformationCard>
    {isAdjusting && <div role="dialog" aria-modal="true" aria-labelledby="loyalty-adjustment-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 id="loyalty-adjustment-title" className="text-lg font-semibold text-slate-900">Adjust Loyalty Points</h2><p className="mt-2 text-sm text-slate-500">Use a positive value to add points and a negative value to deduct them. Every adjustment is recorded in the loyalty ledger.</p><div className="mt-5 space-y-4"><label className="block text-sm font-medium text-slate-700">Points<input type="number" step="1" {...register('points')} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>{errors.points && <p className="-mt-3 text-xs text-red-600">{errors.points.message}</p>}<label className="block text-sm font-medium text-slate-700">Reason<textarea rows={3} {...register('reason')} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>{errors.reason && <p className="-mt-3 text-xs text-red-600">{errors.reason.message}</p>}{adjustment.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage(adjustment.error)}</p>}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => { setIsAdjusting(false); reset(); }} disabled={adjustment.isPending} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button><button disabled={adjustment.isPending} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{adjustment.isPending ? 'Saving…' : 'Save Adjustment'}</button></div></form></div>}
  </section>;
};

const Stat = ({ label, value, emphasis, signed }: { label: string; value: number; emphasis?: boolean; signed?: boolean }) => <div className={`rounded-lg p-4 ${emphasis ? 'bg-brand-50' : 'bg-slate-50'}`}><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${emphasis ? 'text-brand-700' : 'text-slate-900'}`}>{signed && value > 0 ? '+' : ''}{value.toLocaleString('en-IN')}</p></div>;
