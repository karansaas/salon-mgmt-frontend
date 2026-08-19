import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../features/auth/AuthProvider';

const schema = z.object({ email: z.string().email('Enter a valid email'), password: z.string().min(1, 'Password is required') });
type LoginForm = z.infer<typeof schema>;

export const LoginPage = () => {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({ resolver: zodResolver(schema) });
  const submit = async (data: LoginForm) => { try { await login(data.email, data.password); navigate(location.state?.from?.pathname ?? '/', { replace: true }); } catch (error) { const message = axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message : 'Unable to sign in'; setError('root', { message }); } };
  return <div className="grid min-h-screen bg-slate-100 lg:grid-cols-2"><div className="hidden bg-slate-950 p-12 text-white lg:block"><div className="text-3xl font-bold">Lush<span className="text-blue-400">Salon</span></div><div className="mt-40 max-w-md"><h1 className="text-5xl font-bold leading-tight">Run your salon with clarity.</h1><p className="mt-6 text-lg text-slate-300">One simple place for your team, clients, and daily operations.</p></div></div><div className="flex items-center justify-center p-6"><form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"><div className="mb-8"><p className="text-2xl font-bold text-slate-900">Welcome back</p><p className="mt-2 text-sm text-slate-500">Sign in to access your salon workspace.</p></div><label className="block text-sm font-medium text-slate-700">Email<input autoComplete="email" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" {...register('email')} /></label>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}<label className="mt-5 block text-sm font-medium text-slate-700">Password<input type="password" autoComplete="current-password" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" {...register('password')} /></label>{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}{errors.root && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.root.message}</p>}<button disabled={isSubmitting} className="mt-7 w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? 'Signing in…' : 'Sign in'}</button></form></div></div>;
};
