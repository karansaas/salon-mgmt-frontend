import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ClientForm } from '../features/clients/ClientForm';
import { createClient, getClient, updateClient } from '../features/clients/clients.api';
import type { ClientInput } from '../features/clients/types';

const apiMessage = (error: unknown): string => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const PageHeading = ({ title, description }: { title: string; description: string }) => <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><Link to="/clients" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white">Back to clients</Link></div>;

export const AddClientPage = () => {
  const navigate = useNavigate(); const [error, setError] = useState<string>();
  const mutation = useMutation({ mutationFn: createClient });
  const submit = async (values: ClientInput) => { setError(undefined); try { await mutation.mutateAsync(values); navigate('/clients', { state: { message: 'Client added successfully.' } }); } catch (requestError) { setError(apiMessage(requestError)); } };
  return <div><PageHeading title="Add Client" description="Create a new client record for your salon." /><ClientForm submitLabel="Add Client" isSubmitting={mutation.isPending} serverError={error} onSubmit={submit} /></div>;
};

export const EditClientPage = () => {
  const { id = '' } = useParams(); const navigate = useNavigate(); const [error, setError] = useState<string>();
  const clientQuery = useQuery({ queryKey: ['client', id], queryFn: () => getClient(id), enabled: Boolean(id) });
  const mutation = useMutation({ mutationFn: updateClient });
  const submit = async (values: ClientInput) => { setError(undefined); try { await mutation.mutateAsync({ id, payload: values }); navigate('/clients', { state: { message: 'Client updated successfully.' } }); } catch (requestError) { setError(apiMessage(requestError)); } };
  if (clientQuery.isLoading) return <p className="text-sm text-slate-500">Loading client…</p>;
  if (clientQuery.isError || !clientQuery.data) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{clientQuery.isError ? apiMessage(clientQuery.error) : 'Client not found'}</div>;
  const { firstName, lastName, mobileNumber, gender, dateOfBirth, email, address, notes } = clientQuery.data;
  return <div><PageHeading title="Edit Client" description="Update this client’s information." /><ClientForm initialValues={{ firstName, lastName, mobileNumber, gender, dateOfBirth: dateOfBirth?.slice(0, 10), email, address, notes }} submitLabel="Save Changes" isSubmitting={mutation.isPending} serverError={error} onSubmit={submit} /></div>;
};
