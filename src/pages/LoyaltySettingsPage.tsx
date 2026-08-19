import axios from 'axios';
import { useEffect, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InformationCard } from '../components/ui/InformationCard';
import { useAuth } from '../features/auth/AuthProvider';
import { getLoyaltyConfig, updateLoyaltyConfig } from '../features/loyalty/loyalty.api';
import type { LoyaltyConfig } from '../features/loyalty/types';

const schema = z.object({ spendPerPoint: z.coerce.number().positive('Eligible spend must be greater than zero'), minimumRedemptionPoints: z.coerce.number().int('Minimum points must be a whole number').positive('Minimum points must be greater than zero'), redemptionPoints: z.coerce.number().int('Redemption points must be a whole number').positive('Redemption points must be greater than zero'), redemptionValue: z.coerce.number().positive('Redemption value must be greater than zero') });
type Values = z.infer<typeof schema>;
const errorMessage = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Unable to save loyalty settings' : 'Unable to save loyalty settings';

export const LoyaltySettingsPage = () => {
  const { user } = useAuth(); const [success, setSuccess] = useState(''); const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['loyalty-config'], queryFn: getLoyaltyConfig, enabled: user?.role === 'Admin' });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  useEffect(() => { if (query.data) reset(query.data); }, [query.data, reset]);
  const mutation = useMutation({ mutationFn: updateLoyaltyConfig, onSuccess: async (config) => { setSuccess('Loyalty settings saved. New bills will use these rules.'); reset(config); await queryClient.invalidateQueries({ queryKey: ['loyalty-config'] }); await queryClient.invalidateQueries({ queryKey: ['client-loyalty'] }); } });
  if (user?.role !== 'Admin') return <InformationCard title="Loyalty Settings"><p className="text-sm text-slate-600">Only administrators can manage loyalty settings.</p></InformationCard>;
  if (query.isLoading) return <p className="text-sm text-slate-500">Loading loyalty settings…</p>;
  if (query.isError) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{errorMessage(query.error)}</div>;
  const submit = (values: Values) => { setSuccess(''); mutation.mutate(values as LoyaltyConfig); };
  return <div className="max-w-2xl space-y-6"><div><h2 className="text-2xl font-bold text-slate-900">Loyalty Settings</h2><p className="mt-1 text-sm text-slate-500">Set the points customers earn and the value of a redemption.</p></div><InformationCard title="Loyalty Rules"><form onSubmit={handleSubmit(submit)} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Eligible spend per point (₹)" error={errors.spendPerPoint?.message}><input type="number" min="0.01" step="0.01" {...register('spendPerPoint')} className="input" /></Field><Field label="Minimum points to redeem" error={errors.minimumRedemptionPoints?.message}><input type="number" min="1" step="1" {...register('minimumRedemptionPoints')} className="input" /></Field><Field label="Points per redemption" error={errors.redemptionPoints?.message}><input type="number" min="1" step="1" {...register('redemptionPoints')} className="input" /></Field><Field label="Redemption value (₹)" error={errors.redemptionValue?.message}><input type="number" min="0.01" step="0.01" {...register('redemptionValue')} className="input" /></Field></div><p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Example: ₹{query.data?.spendPerPoint} eligible spend earns 1 point. {query.data?.redemptionPoints} points can be redeemed for ₹{query.data?.redemptionValue}.</p>{success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}{mutation.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage(mutation.error)}</p>}<div className="flex justify-end"><button disabled={mutation.isPending} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{mutation.isPending ? 'Saving…' : 'Save Loyalty Settings'}</button></div></form></InformationCard><p className="text-xs text-slate-500">These settings apply to new loyalty earnings and redemptions. Existing invoices and loyalty ledger entries remain unchanged.</p></div>;
};

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => <label className="block text-sm font-medium text-slate-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
