import { Link } from 'react-router-dom';
import { InformationCard } from '../components/ui/InformationCard';
import { useAuth } from '../features/auth/AuthProvider';

export const MyAttendancePage = () => {
  const { user } = useAuth();
  return <div className="mx-auto max-w-3xl space-y-6">
    <div>
      <p className="text-sm font-medium text-brand-600">Employee workspace</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">My Attendance</h2>
      <p className="mt-1 text-sm text-slate-500">Your attendance tools and work status will appear here.</p>
    </div>
    <InformationCard title="Your Profile">
      <dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Employee</dt><dd className="mt-1 text-sm font-medium text-slate-800">{user?.name}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Login Email</dt><dd className="mt-1 text-sm text-slate-800">{user?.email}</dd></div></dl>
    </InformationCard>
    <InformationCard title="Attendance">
      <div className="rounded-lg bg-slate-50 p-5"><p className="font-medium text-slate-800">Clock in and Clock out are not enabled yet.</p><p className="mt-2 text-sm text-slate-600">Attendance records will be introduced with the next attendance milestone. Nothing is recorded from this page yet.</p></div>
    </InformationCard>
    <div><Link to="/billing" className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Go to Billing</Link></div>
  </div>;
};
