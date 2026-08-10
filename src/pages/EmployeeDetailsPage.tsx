import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { InformationCard } from '../components/ui/InformationCard';
import { getEmployeeProfile } from '../features/employees/employees.api';

const msg = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const Detail = ({ label, value }: { label: string; value: string }) => <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm text-slate-700">{value}</dd></div>;
const date = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
const money = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export const EmployeeDetailsPage = () => {
  const { id = '' } = useParams();
  const query = useQuery({ queryKey: ['employee-profile', id], queryFn: () => getEmployeeProfile(id), enabled: Boolean(id) });
  if (query.isLoading) return <p className="text-sm text-slate-500">Loading employee profile…</p>;
  if (query.isError || !query.data) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{query.isError ? msg(query.error) : 'Employee not found'}</div>;
  const { employee, assignedServices, metrics, serviceHistory } = query.data;
  return <div className="space-y-6">
    <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-brand-600">Employee profile</p><h2 className="mt-1 text-2xl font-bold">{employee.firstName} {employee.lastName}</h2></div><div className="flex gap-3"><Link to={`/employees/${id}/edit`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Edit Employee</Link><Link to="/employees" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Back</Link></div></div>
    <div className="grid gap-6 xl:grid-cols-3"><InformationCard title="Personal Information" className="xl:col-span-2"><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Designation" value={employee.designation} /><Detail label="Joining Date" value={date(employee.joiningDate)} /><Detail label="Gender" value={employee.gender || '—'} /><Detail label="Salary" value={employee.salary === undefined ? '—' : money(employee.salary)} /><Detail label="Status" value={employee.isActive ? 'Active' : 'Inactive'} /><Detail label="Skills" value={employee.skills.length ? employee.skills.join(', ') : '—'} /></dl></InformationCard><InformationCard title="Contact Details"><dl className="space-y-4"><Detail label="Mobile" value={employee.mobileNumber} /><Detail label="Email" value={employee.email || '—'} /><Detail label="Emergency Contact" value={employee.emergencyContact || '—'} /><Detail label="Address" value={employee.address || '—'} /></dl></InformationCard></div>
    <InformationCard title="Assigned Services">{assignedServices.length ? <div className="flex flex-wrap gap-2">{assignedServices.map((service) => <span key={service.id} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-700">{service.name}</span>)}</div> : <p className="text-sm text-slate-500">No services assigned yet.</p>}</InformationCard>
    {employee.notes && <InformationCard title="Notes"><p className="text-sm text-slate-700">{employee.notes}</p></InformationCard>}
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{[['Customers Served', String(metrics.customersServed)], ['Revenue Generated', money(metrics.revenueGenerated)], ['Services Completed', String(metrics.totalServicesPerformed)], ['Average Rating', String(metrics.averageRating)]].map(([title, value]) => <InformationCard key={title} title={title}><p className="text-xl font-bold">{value}</p><p className="mt-2 text-sm text-slate-500">Calculated from billing records.</p></InformationCard>)}</div>
    <InformationCard title="Service History">{serviceHistory.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="pb-3">Date</th><th className="pb-3">Invoice</th><th className="pb-3">Client</th><th className="pb-3">Service</th><th className="pb-3 text-right">Amount</th></tr></thead><tbody className="divide-y">{serviceHistory.map((item, index) => <tr key={`${item.billId}-${index}`}><td className="py-3">{date(item.date)}</td><td className="py-3"><Link to={`/billing/${item.billId}`} className="font-medium text-brand-600">{item.invoiceNumber}</Link></td><td className="py-3">{item.client}</td><td className="py-3">{item.service}</td><td className="py-3 text-right">{money(item.amount)}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">No services have been recorded through billing yet.</p>}</InformationCard>
  </div>;
};
