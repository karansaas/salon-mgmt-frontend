import axios from 'axios';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '../components/ui/Pagination';
import { getAttendance } from '../features/attendance/attendance.api';
import type { AttendanceStatus } from '../features/attendance/types';
import { getEmployees } from '../features/employees/employees.api';

const errorMessage = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Unable to load attendance' : 'Unable to load attendance';
const indiaToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};
const dateLabel = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(`${value}T00:00:00+05:30`));
const timeLabel = (value?: string) => value ? new Intl.DateTimeFormat('en-IN', { timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)) : '—';
const duration = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export const AttendancePage = () => {
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(indiaToday);
  const [to, setTo] = useState(indiaToday);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState<AttendanceStatus | ''>('');
  const employees = useQuery({ queryKey: ['attendance-employees'], queryFn: () => getEmployees({ page: 1, search: '', designation: '', status: 'all', limit: 100 }) });
  const attendance = useQuery({ queryKey: ['attendance', { page, from, to, employeeId, status }], queryFn: () => getAttendance({ page, from, to, employeeId: employeeId || undefined, status: status || undefined }) });
  const reset = (action: () => void) => { action(); setPage(1); };
  const employeeName = (id: string) => {
    const employee = employees.data?.employees.find((item) => item.id === id);
    return employee ? [employee.firstName, employee.lastName].filter(Boolean).join(' ') : 'Employee unavailable';
  };

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-bold text-slate-900">Attendance</h2><p className="mt-1 text-sm text-slate-500">Review employee clock-in and clock-out records.</p></div>
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap">
      <input type="date" aria-label="From date" value={from} onChange={(event) => reset(() => setFrom(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
      <input type="date" aria-label="To date" value={to} onChange={(event) => reset(() => setTo(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
      <select value={employeeId} onChange={(event) => reset(() => setEmployeeId(event.target.value))} disabled={employees.isLoading || employees.isError} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-50">
        <option value="">All employees</option>
        {employees.data?.employees.map((employee) => <option key={employee.id} value={employee.id}>{[employee.firstName, employee.lastName].filter(Boolean).join(' ')}</option>)}
      </select>
      <select value={status} onChange={(event) => reset(() => setStatus(event.target.value as AttendanceStatus | ''))} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="PRESENT">Present</option><option value="ABSENT">Absent</option><option value="HALF_DAY">Half day</option><option value="LEAVE">Leave</option></select>
    </div>
    {employees.isError && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Employee names could not be loaded. Attendance records can still be reviewed.</div>}
    {attendance.isLoading ? <div className="rounded-xl border bg-white p-12 text-center text-sm text-slate-500">Loading attendance…</div> : attendance.isError || !attendance.data ? <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{attendance.isError ? errorMessage(attendance.error) : 'Unable to load attendance.'}</div> : attendance.data.attendance.length ? <div className="space-y-4"><div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Clock In</th><th className="px-5 py-3">Clock Out</th><th className="px-5 py-3">Worked</th></tr></thead><tbody className="divide-y divide-slate-100">{attendance.data.attendance.map((record) => <tr key={record.id}><td className="px-5 py-4 font-medium text-slate-900">{employeeName(record.employeeId)}</td><td className="px-5 py-4">{dateLabel(record.attendanceDate)}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{record.status.replace('_', ' ')}</span></td><td className="px-5 py-4">{timeLabel(record.clockIn)}</td><td className="px-5 py-4">{timeLabel(record.clockOut)}</td><td className="px-5 py-4">{record.clockOut ? duration(record.totalMinutes) : 'In progress'}</td></tr>)}</tbody></table></div><Pagination {...attendance.data.pagination} onPageChange={setPage} /></div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-medium text-slate-800">No attendance records found</p><p className="mt-1 text-sm text-slate-500">Try a different date range or employee filter.</p></div>}
  </div>;
};
