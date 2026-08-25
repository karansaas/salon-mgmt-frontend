import axios from 'axios';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ProductTable } from '../features/products/ProductTable';
import { StockAdjustmentModal } from '../features/products/StockAdjustmentModal';
import { getLowStockProducts } from '../features/products/products.api';
import type { Product, ProductType } from '../features/products/types';

const msg = (error: unknown) => axios.isAxiosError<{ message: string }>(error) ? error.response?.data.message ?? 'Request failed' : 'Something went wrong';
type Props = { productType?: ProductType; basePath?: string; title?: string; };
export const LowStockPage = ({ productType = 'RETAIL', basePath = '/products', title = 'Low Stock' }: Props) => {
  const [adjusting, setAdjusting] = useState<Product | null>(null); const professional = productType === 'PROFESSIONAL';
  const query = useQuery({ queryKey: ['low-stock', productType], queryFn: () => getLowStockProducts(productType) });
  return <div className="space-y-6"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{professional ? 'Professional products at or below their minimum stock level.' : 'Products at or below their minimum stock level.'}</p></div><Link to={basePath} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">Back to products</Link></div>{query.isLoading ? <div className="rounded-xl border bg-white p-12 text-center text-sm text-slate-500">Loading low-stock products…</div> : query.isError ? <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{msg(query.error)}</div> : query.data?.length ? <ProductTable products={query.data} onAdjust={setAdjusting} onDelete={() => undefined} basePath={basePath} professional={professional} highlightLow /> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-medium text-slate-800">Inventory is healthy</p><p className="mt-1 text-sm text-slate-500">No products are below their minimum stock level.</p></div>}<StockAdjustmentModal product={adjusting} onClose={() => setAdjusting(null)} /></div>;
};
