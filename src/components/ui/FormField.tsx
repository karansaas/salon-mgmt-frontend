import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; children?: ReactNode; };

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({ label, error, children, className = '', ...inputProps }, ref) {
  return <label className="block text-sm font-medium text-slate-700">{label}{children ?? <input ref={ref} {...inputProps} className={`mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${className}`} />}{error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}</label>;
});
