import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../features/products/ProductForm';
import { createProduct, getProduct, updateProduct } from '../features/products/products.api';
import type { ProductInput, ProductType } from '../features/products/types';

const msg = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
const Header = ({ title, description, backTo }: { title: string; description: string; backTo: string }) => <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><Link to={backTo} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">Back to products</Link></div>;

type Props = { productType?: ProductType; basePath?: string; };
export const AddProductPage = ({ productType = 'RETAIL', basePath = '/products' }: Props) => {
  const navigate = useNavigate(); const [error, setError] = useState<string>(); const mutation = useMutation({ mutationFn: createProduct });
  const submit = async (data: ProductInput) => { setError(undefined); try { await mutation.mutateAsync(data); navigate(basePath, { state: { message: `${productType === 'PROFESSIONAL' ? 'Professional product' : 'Product'} added successfully.` } }); } catch (cause) { setError(msg(cause)); } };
  const professional = productType === 'PROFESSIONAL';
  return <div><Header title={professional ? 'Add Professional Product' : 'Add Product'} description={professional ? 'Create an internal-use product and record its inventory.' : 'Create a retail product and record its inventory.'} backTo={basePath} /><ProductForm productType={productType} submitLabel={professional ? 'Add Professional Product' : 'Add Product'} isSubmitting={mutation.isPending} serverError={error} onSubmit={submit} /></div>;
};

export const EditProductPage = ({ productType = 'RETAIL', basePath = '/products' }: Props) => {
  const { id = '' } = useParams(); const navigate = useNavigate(); const [error, setError] = useState<string>(); const query = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: Boolean(id) }); const mutation = useMutation({ mutationFn: updateProduct }); const professional = productType === 'PROFESSIONAL';
  const submit = async (data: ProductInput) => { setError(undefined); try { await mutation.mutateAsync({ id, data }); navigate(basePath, { state: { message: `${professional ? 'Professional product' : 'Product'} updated successfully.` } }); } catch (cause) { setError(msg(cause)); } };
  if (query.isLoading) return <p className="text-sm text-slate-500">Loading product…</p>;
  if (query.isError || !query.data || query.data.productType !== productType) return <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{query.isError ? msg(query.error) : 'Product not found'}</div>;
  return <div><Header title={professional ? 'Edit Professional Product' : 'Edit Product'} description="Update product details and stock settings." backTo={basePath} /><ProductForm initialValues={query.data} productType={productType} submitLabel="Save Changes" isSubmitting={mutation.isPending} serverError={error} onSubmit={submit} /></div>;
};
