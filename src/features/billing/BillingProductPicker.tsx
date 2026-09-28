import { useMemo, useState } from 'react';

type BillingProduct = { id: string; name: string; sku?: string; sellingPrice: number; currentStock: number; imageUrl?: string; };

const money = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const BillingProductPicker = ({ products, value, onChange, isLoading, isError }: { products: BillingProduct[]; value: string; onChange(value: string): void; isLoading: boolean; isError: boolean; }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = products.find((product) => product.id === value);
  const matches = useMemo(() => products.filter((product) => `${product.name} ${product.sku ?? ''}`.toLowerCase().includes(search.trim().toLowerCase())), [products, search]);

  const choose = (id: string) => { onChange(id); setOpen(false); setSearch(''); };
  return <div className="relative"><button type="button" onClick={() => setOpen((visible) => !visible)} className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 text-left text-sm"><div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-slate-100">{selected?.imageUrl && <img src={selected.imageUrl} alt="" className="h-full w-full object-cover" />}</div><span className="min-w-0 flex-1 truncate">{selected ? `${selected.name}${selected.sku ? ` (${selected.sku})` : ''} · ${money(selected.sellingPrice)} · Stock ${selected.currentStock}` : 'Select product'}</span><span className="text-slate-400">⌄</span></button>{open && <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg"><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="mb-2 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" />{isLoading ? <p className="p-3 text-sm text-slate-500">Loading products…</p> : isError ? <p className="p-3 text-sm text-red-600">Products could not be loaded.</p> : !matches.length ? <p className="p-3 text-sm text-slate-500">No matching products found.</p> : <div className="max-h-64 overflow-y-auto">{matches.map((product) => <button type="button" key={product.id} onClick={() => choose(product.id)} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50"><div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-100">{product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}</div><span className="min-w-0 flex-1"><span className="block truncate font-medium text-slate-800">{product.name}{product.sku ? ` (${product.sku})` : ''}</span><span className="block text-xs text-slate-500">{money(product.sellingPrice)} · Stock {product.currentStock}</span></span></button>)}</div>}</div>}</div>;
};
