import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { clockIn, clockOut, getCurrentAttendance, getMyAttendanceHistory, getMyLeaveRequests, requestLeave } from '../features/attendance/attendance.api';
import { InformationCard } from '../components/ui/InformationCard';
import { Pagination } from '../components/ui/Pagination';
import { useAuth } from '../features/auth/AuthProvider';

const errorMessage = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Unable to update attendance' : 'Unable to update attendance';
const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value));
const duration = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export const MyAttendancePage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leavePage, setLeavePage] = useState(1);
  const queryClient = useQueryClient();
  const current = useQuery({ queryKey: ['my-attendance-current'], queryFn: getCurrentAttendance });
  const history = useQuery({ queryKey: ['my-attendance-history', page], queryFn: () => getMyAttendanceHistory(page) });
  const leaveRequests = useQuery({ queryKey: ['my-leave-requests', leavePage], queryFn: () => getMyLeaveRequests(leavePage) });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-attendance-current'] });
    await queryClient.invalidateQueries({ queryKey: ['my-attendance-history'] });
    await queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
  };
  const checkIn = useMutation({ mutationFn: clockIn, onSuccess: async () => { setMessage('You have clocked in successfully.'); await refresh(); } });
  const checkOut = useMutation({ mutationFn: clockOut, onSuccess: async () => { setMessage('You have clocked out successfully.'); await refresh(); } });
  const leave = useMutation({ mutationFn: requestLeave, onSuccess: async () => { setLeaveStartDate(''); setLeaveEndDate(''); setLeaveReason(''); setMessage('Your leave request has been submitted for approval.'); await refresh(); } });
  const actionError = checkIn.isError ? errorMessage(checkIn.error) : checkOut.isError ? errorMessage(checkOut.error) : leave.isError ? errorMessage(leave.error) : '';
  const state = current.data?.state;
  return <div className="mx-auto max-w-3xl space-y-6">
    <div>
      <p className="text-sm font-medium text-brand-600">Employee workspace</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">My Attendance</h2>
      <p className="mt-1 text-sm text-slate-500">Track your daily clock-in and clock-out times.</p>
    </div>
    <InformationCard title="Your Profile">
      <dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Employee</dt><dd className="mt-1 text-sm font-medium text-slate-800">{user?.name}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Login Email</dt><dd className="mt-1 text-sm text-slate-800">{user?.email}</dd></div></dl>
    </InformationCard>
    <InformationCard title="Today's Attendance">
      {current.isLoading ? <div className="h-28 animate-pulse rounded-lg bg-slate-100" /> : current.isError || !current.data ? <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{current.isError ? errorMessage(current.error) : 'Unable to load attendance status.'}</div> : <div className="space-y-4"><div className="rounded-lg bg-slate-50 p-4"><p className="text-sm font-medium text-slate-800">{state === 'NOT_CLOCKED_IN' ? 'You have not clocked in today.' : state === 'CLOCKED_IN' ? 'You are currently clocked in.' : state === 'RECORDED' ? `${current.data.attendance?.status.replace(/_/g, ' ')} has been recorded for today.` : 'You have completed attendance for today.'}</p>{current.data.attendance && <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-slate-500">Clock in</dt><dd className="mt-1 font-medium">{current.data.attendance.clockIn ? dateTime(current.data.attendance.clockIn) : 'Recorded by admin'}</dd></div><div><dt className="text-slate-500">Clock out</dt><dd className="mt-1 font-medium">{current.data.attendance.clockOut ? dateTime(current.data.attendance.clockOut) : '—'}</dd></div><div><dt className="text-slate-500">Worked</dt><dd className="mt-1 font-medium">{current.data.attendance.clockIn ? duration(current.data.elapsedMinutes) : '—'}</dd></div></dl>}</div>{message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}{actionError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}<div className="flex flex-wrap gap-3">{state === 'NOT_CLOCKED_IN' && <button type="button" onClick={() => { setMessage(''); checkIn.mutate(); }} disabled={checkIn.isPending} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{checkIn.isPending ? 'Clocking in…' : 'Clock In'}</button>}{state === 'CLOCKED_IN' && <button type="button" onClick={() => { setMessage(''); checkOut.mutate(); }} disabled={checkOut.isPending} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{checkOut.isPending ? 'Clocking out…' : 'Clock Out'}</button>}</div></div>}
    </InformationCard>
    <InformationCard title="Attendance History">
      {history.isLoading ? <div className="h-40 animate-pulse rounded-lg bg-slate-100" /> : history.isError || !history.data ? <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{history.isError ? errorMessage(history.error) : 'Unable to load attendance history.'}</div> : history.data.attendance.length ? <div className="space-y-4"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Clock In</th><th className="px-3 py-2">Clock Out</th><th className="px-3 py-2">Worked</th></tr></thead><tbody className="divide-y divide-slate-100">{history.data.attendance.map((record) => <tr key={record.id}><td className="px-3 py-3 font-medium">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(`${record.attendanceDate}T00:00:00+05:30`))}</td><td className="px-3 py-3">{record.status.replace(/_/g, ' ')}</td><td className="px-3 py-3">{record.clockIn ? dateTime(record.clockIn) : '—'}</td><td className="px-3 py-3">{record.clockOut ? dateTime(record.clockOut) : '—'}</td><td className="px-3 py-3">{record.clockIn ? record.clockOut ? duration(record.totalMinutes) : 'In progress' : '—'}</td></tr>)}</tbody></table></div><Pagination {...history.data.pagination} onPageChange={setPage} /></div> : <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No attendance records available yet.</div>}
    </InformationCard>
    <InformationCard title="Request Leave"><form onSubmit={(event) => { event.preventDefault(); leave.mutate({ startDate: leaveStartDate, endDate: leaveEndDate, reason: leaveReason }); }} className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Start date<input required type="date" min={new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())} value={leaveStartDate} onChange={(event) => setLeaveStartDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><label className="text-sm font-medium text-slate-700">End date<input required type="date" min={leaveStartDate || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())} value={leaveEndDate} onChange={(event) => setLeaveEndDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><label className="sm:col-span-2 text-sm font-medium text-slate-700">Reason<textarea required minLength={3} value={leaveReason} onChange={(event) => setLeaveReason(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5" rows={3} /></label><div className="sm:col-span-2"><button disabled={leave.isPending} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{leave.isPending ? 'Submitting…' : 'Request Leave'}</button></div></form>{leaveRequests.data?.requests.length ? <div className="mt-6 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Dates</th><th className="px-3 py-2">Reason</th><th className="px-3 py-2">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{leaveRequests.data.requests.map((request) => <tr key={request.id}><td className="px-3 py-3">{request.startDate} – {request.endDate}</td><td className="px-3 py-3">{request.reason}</td><td className="px-3 py-3">{request.status}</td></tr>)}</tbody></table><div className="mt-3"><Pagination {...leaveRequests.data.pagination} itemLabel="leave request" onPageChange={setLeavePage} /></div></div> : null}</InformationCard>
    {user?.role === 'Receptionist' && <div><Link to="/billing" className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Go to Billing</Link></div>}
  </div>;
};
