import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../components/ui/FormField';
import type { ClientInput } from './types';

const clientSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().max(100).optional(),
  mobileNumber: z.string().trim().refine((value) => !value || /^\+?[1-9]\d{7,14}$/.test(value.replace(/[\s()-]/g, '')), 'Enter a valid mobile number').optional(),
  gender: z.union([z.enum(['Male', 'Female', 'Other']), z.literal('')]).optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().trim().refine((value) => !value || /^\S+@\S+\.\S+$/.test(value), 'Enter a valid email').optional(),
  address: z.string().max(500, 'Address must be 500 characters or fewer').optional(),
  notes: z.string().max(2000, 'Notes must be 2,000 characters or fewer').optional(),
});
type ClientFormValues = z.infer<typeof clientSchema>;
type ClientFormProps = { initialValues?: ClientInput; submitLabel: string; isSubmitting?: boolean; serverError?: string; onSubmit(values: ClientInput): Promise<void>; };

export const ClientForm = ({ initialValues, submitLabel, isSubmitting, serverError, onSubmit }: ClientFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormValues>({ resolver: zodResolver(clientSchema), defaultValues: { firstName: '', lastName: '', mobileNumber: '', gender: '', dateOfBirth: '', email: '', address: '', notes: '', ...initialValues } });
  const submit = async (values: ClientFormValues) => {
    const cleanValues: ClientInput = { ...values, lastName: values.lastName || undefined, mobileNumber: values.mobileNumber || undefined, gender: values.gender || undefined, dateOfBirth: values.dateOfBirth || undefined, email: values.email || undefined, address: values.address || undefined, notes: values.notes || undefined };
    await onSubmit(cleanValues);
  };
  return <form onSubmit={handleSubmit(submit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-sm text-slate-500"><span className="font-medium text-red-600">*</span> Required field</p><div className="grid gap-5 sm:grid-cols-2"><FormField label="First Name *" error={errors.firstName?.message} required autoComplete="given-name" {...register('firstName')} /><FormField label="Last Name (optional)" error={errors.lastName?.message} autoComplete="family-name" {...register('lastName')} /><FormField label="Mobile Number (optional)" error={errors.mobileNumber?.message} inputMode="tel" autoComplete="tel" {...register('mobileNumber')} /><FormField label="Gender (optional)" error={errors.gender?.message}>{<select {...register('gender')} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select>}</FormField><FormField label="Date of Birth (optional)" error={errors.dateOfBirth?.message} type="date" {...register('dateOfBirth')} /><FormField label="Email (optional)" error={errors.email?.message} type="email" autoComplete="email" {...register('email')} /></div><label className="block text-sm font-medium text-slate-700">Address (optional)<textarea rows={3} {...register('address')} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" /></label>{errors.address && <p className="-mt-4 text-xs text-red-600">{errors.address.message}</p>}<label className="block text-sm font-medium text-slate-700">Notes (optional)<textarea rows={4} {...register('notes')} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" /></label>{errors.notes && <p className="-mt-4 text-xs text-red-600">{errors.notes.message}</p>}{serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}<div className="flex justify-end"><button disabled={isSubmitting} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? 'Saving…' : submitLabel}</button></div></form>;
};
