import axios from 'axios';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generatePayroll, getPayroll, releasePayroll } from '../features/payroll/payroll.api';
import type { PayrollRecord } from '../features/payroll/types';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorMessage = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Unable to process payroll' : 'Unable to process payroll';
const indiaToday = () => {
  const values = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => values.find((value) => value.type === type)?.value ?? '';
  return { year: Number(part('year')), month: Number(part('month')), day: Number(part('day')) };
};
const defaultCycle = () => {
  const today = indiaToday();
  const date = new Date(Date.UTC(today.year, today.month - 2, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
};
const dateLabel = (value?: string) => {
  if (!value) return 'Date unavailable';
  const source = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+05:30` : value;
  const date = new Date(source);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(date);
};

export const PayrollPage = () => {
  const [cycle, setCycle] = useState(defaultCycle);
  const [payrollToRelease, setPayrollToRelease] = useState<PayrollRecord | null>(null);
  const queryClient = useQueryClient();
  const payroll = useQuery({ queryKey: ['payroll', cycle], queryFn: () => getPayroll(cycle) });
  const generate = useMutation({ mutationFn: () => generatePayroll(cycle), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', cycle] }) });
  const release = useMutation({ mutationFn: releasePayroll, onSuccess: async () => { setPayrollToRelease(null); await queryClient.invalidateQueries({ queryKey: ['payroll', cycle] }); } });
  const totalPayable = useMemo(() => payroll.data?.payroll.reduce((sum, item) => sum + item.payableAmount, 0) ?? 0, [payroll.data]);
  const error = payroll.isError ? errorMessage(payroll.error) : generate.isError ? errorMessage(generate.error) : release.isError ? errorMessage(release.error) : '';
  const today = indiaToday();
  const todayValue = `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`;
  const cycleLabel = payroll.data ? `${dateLabel(payroll.data.cycle.start)} – ${dateLabel(payroll.data.cycle.end)}` : 'Full calendar month';
  const releaseAllowed = Boolean(payroll.data && todayValue >= payroll.data.cycle.releaseDate);

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold text-slate-900">Payroll</h2><p className="mt-1 text-sm text-slate-500">Each salary sheet covers a full calendar month and is released on the 15th of the following month. Each month includes 2 paid leave days; from the third leave onward, 2 days’ salary is deducted for each leave.</p></div><div className="flex flex-wrap gap-3"><label className="text-sm font-medium text-slate-700">Salary month<input type="month" value={cycle} max={defaultCycle()} onChange={(event) => setCycle(event.target.value)} className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2.5" /></label><button type="button" onClick={() => generate.mutate()} disabled={generate.isPending || !cycle} className="self-end rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{generate.isPending ? 'Calculating…' : 'Generate Salary Sheet'}</button></div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard label="Salary Month" value={cycleLabel} /><SummaryCard label="Release Date" value={payroll.data ? dateLabel(payroll.data.cycle.releaseDate) : '15th of next month'} /><SummaryCard label="Employees" value={String(payroll.data?.summary?.employees ?? payroll.data?.payroll.length ?? 0)} /><SummaryCard label="Total Payable" value={money(totalPayable)} /></div>
    {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {payroll.isLoading ? <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading payroll…</div> : payroll.isError || !payroll.data ? null : payroll.data.payroll.length ? <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3 text-right">Monthly Salary</th><th className="px-5 py-3 text-center">Present</th><th className="px-5 py-3 text-center">Half Day</th><th className="px-5 py-3 text-center">Absent</th><th className="px-5 py-3 text-center">Leave</th><th className="px-5 py-3 text-right">Payable</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{payroll.data.payroll.map((item) => <tr key={item.id}><td className="px-5 py-4 font-medium text-slate-900">{item.employeeName}<p className="mt-1 text-xs font-normal text-slate-500">{item.paidDays} paid days · {item.eligibleDays} eligible days</p></td><td className="px-5 py-4 text-right">{money(item.monthlySalary)}</td><td className="px-5 py-4 text-center text-emerald-700">{item.presentDays}</td><td className="px-5 py-4 text-center text-amber-700">{item.halfDays}{item.medicalHalfDays ? <p className="mt-1 text-xs text-sky-700">{item.medicalHalfDays} medical paid</p> : null}</td><td className="px-5 py-4 text-center text-red-700">{item.absentDays}</td><td className="px-5 py-4 text-center text-slate-600">{item.leaveDays}<p className="mt-1 text-xs text-slate-500">{item.paidLeaveDays} paid{item.excessLeaveDays ? ` · ${item.leavePenaltyDays} deduction days` : ''}</p></td><td className="px-5 py-4 text-right font-semibold">{money(item.payableAmount)}<p className="mt-1 text-xs font-normal text-slate-500">Deduction {money(item.deductionAmount)}</p></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status === 'RELEASED' ? 'Released' : 'Draft'}</span></td><td className="px-5 py-4 text-right">{item.status === 'DRAFT' ? <button type="button" onClick={() => setPayrollToRelease(item)} disabled={release.isPending || !releaseAllowed} title={releaseAllowed ? 'Release salary' : `Available on ${dateLabel(payroll.data.cycle.releaseDate)}`} className="rounded-lg border border-brand-600 px-3 py-1.5 text-xs font-semibold text-brand-700 disabled:cursor-not-allowed disabled:opacity-60">Release Salary</button> : <span className="text-xs text-slate-500">{item.releasedAt ? dateLabel(item.releasedAt) : 'Released'}</span>}</td></tr>)}</tbody></table></div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-medium text-slate-800">No salary sheet generated yet</p><p className="mt-1 text-sm text-slate-500">Generate the selected month to calculate salaries from attendance.</p></div>}
    {payrollToRelease && <div role="dialog" aria-modal="true" aria-labelledby="release-salary-title" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h3 id="release-salary-title" className="text-lg font-bold text-slate-900">Release salary?</h3><p className="mt-3 text-sm text-slate-600">You are about to release <b>{money(payrollToRelease.payableAmount)}</b> for <b>{payrollToRelease.employeeName}</b> for {cycleLabel}.</p><p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Once released, attendance changes for this salary month will be locked.</p>{release.isError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage(release.error)}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setPayrollToRelease(null)} disabled={release.isPending} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60">Cancel</button><button type="button" onClick={() => release.mutate(payrollToRelease.id)} disabled={release.isPending} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{release.isPending ? 'Releasing…' : 'Confirm Release'}</button></div></div></div>}
  </div>;
};

const SummaryCard = ({ label, value }: { label: string; value: string }) => <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-lg font-bold text-slate-900">{value}</p></div>;
