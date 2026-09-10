import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { clockIn, clockOut, getCurrentAttendance, getMyAttendanceHistory } from '../features/attendance/attendance.api';
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
  const queryClient = useQueryClient();
  const current = useQuery({ queryKey: ['my-attendance-current'], queryFn: getCurrentAttendance });
  const history = useQuery({ queryKey: ['my-attendance-history', page], queryFn: () => getMyAttendanceHistory(page) });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-attendance-current'] });
    await queryClient.invalidateQueries({ queryKey: ['my-attendance-history'] });
  };
  const checkIn = useMutation({ mutationFn: clockIn, onSuccess: async () => { setMessage('You have clocked in successfully.'); await refresh(); } });
  const checkOut = useMutation({ mutationFn: clockOut, onSuccess: async () => { setMessage('You have clocked out successfully.'); await refresh(); } });
  const actionError = checkIn.isError ? errorMessage(checkIn.error) : checkOut.isError ? errorMessage(checkOut.error) : '';
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
      {current.isLoading ? <div className="h-28 animate-pulse rounded-lg bg-slate-100" /> : current.isError || !current.data ? <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{current.isError ? errorMessage(current.error) : 'Unable to load attendance status.'}</div> : <div className="space-y-4"><div className="rounded-lg bg-slate-50 p-4"><p className="text-sm font-medium text-slate-800">{state === 'NOT_CLOCKED_IN' ? 'You have not clocked in today.' : state === 'CLOCKED_IN' ? 'You are currently clocked in.' : 'You have completed attendance for today.'}</p>{current.data.attendance && <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-slate-500">Clock in</dt><dd className="mt-1 font-medium">{dateTime(current.data.attendance.clockIn)}</dd></div><div><dt className="text-slate-500">Clock out</dt><dd className="mt-1 font-medium">{current.data.attendance.clockOut ? dateTime(current.data.attendance.clockOut) : 'Not yet'}</dd></div><div><dt className="text-slate-500">Worked</dt><dd className="mt-1 font-medium">{duration(current.data.elapsedMinutes)}</dd></div></dl>}</div>{message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}{actionError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}<div className="flex flex-wrap gap-3">{state === 'NOT_CLOCKED_IN' && <button type="button" onClick={() => { setMessage(''); checkIn.mutate(); }} disabled={checkIn.isPending} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{checkIn.isPending ? 'Clocking in…' : 'Clock In'}</button>}{state === 'CLOCKED_IN' && <button type="button" onClick={() => { setMessage(''); checkOut.mutate(); }} disabled={checkOut.isPending} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{checkOut.isPending ? 'Clocking out…' : 'Clock Out'}</button>}</div></div>}
    </InformationCard>
    <InformationCard title="Attendance History">
      {history.isLoading ? <div className="h-40 animate-pulse rounded-lg bg-slate-100" /> : history.isError || !history.data ? <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{history.isError ? errorMessage(history.error) : 'Unable to load attendance history.'}</div> : history.data.attendance.length ? <div className="space-y-4"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Clock In</th><th className="px-3 py-2">Clock Out</th><th className="px-3 py-2">Worked</th></tr></thead><tbody className="divide-y divide-slate-100">{history.data.attendance.map((record) => <tr key={record.id}><td className="px-3 py-3 font-medium">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(`${record.attendanceDate}T00:00:00+05:30`))}</td><td className="px-3 py-3">{dateTime(record.clockIn)}</td><td className="px-3 py-3">{record.clockOut ? dateTime(record.clockOut) : '—'}</td><td className="px-3 py-3">{record.clockOut ? duration(record.totalMinutes) : 'In progress'}</td></tr>)}</tbody></table></div><Pagination {...history.data.pagination} onPageChange={setPage} /></div> : <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No attendance records available yet.</div>}
    </InformationCard>
    <div><Link to="/billing" className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Go to Billing</Link></div>
  </div>;
};
