import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../components/ui/FormField';
import { PRODUCT_CATEGORIES, type Product, type ProductCategory, type ProductInput, type ProductType } from './types';

const nonNegative = (label: string) => z.string().trim().refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, `${label} must be zero or greater`);
const positive = (label: string) => z.string().trim().refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, `${label} must be greater than zero`);
const productSchema = (productType: ProductType) => z.object({
  name: z.string().trim().min(1, 'Product name is required').max(150),
  category: z.enum(PRODUCT_CATEGORIES, { required_error: 'Category is required' }),
  brand: z.string().max(100).optional(), description: z.string().max(2000).optional(),
  purchasePrice: positive('Purchase price'),
  sellingPrice: productType === 'RETAIL' ? positive('Selling price') : nonNegative('Selling price'),
  currentStock: nonNegative('Current stock'), minimumStockLevel: nonNegative('Minimum stock level'),
  purchaseDate: z.string().optional(), sku: z.string().optional(), barcode: z.string().optional(), isActive: z.boolean(),
});
type Values = z.infer<ReturnType<typeof productSchema>>;
type Props = { initialValues?: Product; productType?: ProductType; submitLabel: string; isSubmitting?: boolean; serverError?: string; onSubmit(values: ProductInput): Promise<void>; };

export const ProductForm = ({ initialValues, productType = 'RETAIL', submitLabel, isSubmitting, serverError, onSubmit }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(productSchema(productType)),
    defaultValues: {
      name: '', category: undefined, brand: '', description: '', purchasePrice: '', sellingPrice: productType === 'RETAIL' ? '' : '0', currentStock: '0', minimumStockLevel: '5', purchaseDate: '', sku: '', barcode: '', isActive: true,
      ...(initialValues ? { ...initialValues, purchasePrice: String(initialValues.purchasePrice), sellingPrice: String(initialValues.sellingPrice), currentStock: String(initialValues.currentStock), minimumStockLevel: String(initialValues.minimumStockLevel), purchaseDate: initialValues.purchaseDate?.slice(0, 10) } : {}),
    },
  });
  const submit = async (values: Values) => onSubmit({ name: values.name.trim(), productType, category: values.category as ProductCategory, brand: values.brand?.trim() || undefined, description: values.description?.trim() || undefined, purchasePrice: Number(values.purchasePrice), sellingPrice: productType === 'RETAIL' ? Number(values.sellingPrice) : 0, currentStock: Number(values.currentStock), minimumStockLevel: Number(values.minimumStockLevel), purchaseDate: values.purchaseDate || undefined, sku: values.sku?.trim() || undefined, barcode: values.barcode?.trim() || undefined, isActive: values.isActive });
  return <form onSubmit={handleSubmit(submit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-sm text-slate-500"><span className="font-medium text-red-600">*</span> Required field</p><div className="grid gap-5 sm:grid-cols-2"><FormField label="Product Name *" error={errors.name?.message} required {...register('name')} /><FormField label="Category *" error={errors.category?.message}><select {...register('category')} className="input"><option value="">Select category</option>{PRODUCT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></FormField><FormField label="Brand (optional)" error={errors.brand?.message} {...register('brand')} /><FormField label="SKU (optional)" error={errors.sku?.message} {...register('sku')} /><FormField label="Purchase Price *" error={errors.purchasePrice?.message} required type="number" min="0" step="0.01" {...register('purchasePrice')} />{productType === 'RETAIL' && <FormField label="Selling Price *" error={errors.sellingPrice?.message} required type="number" min="0" step="0.01" {...register('sellingPrice')} />}<FormField label="Current Stock *" error={errors.currentStock?.message} required type="number" min="0" step="1" {...register('currentStock')} /><FormField label="Minimum Stock Level *" error={errors.minimumStockLevel?.message} required type="number" min="0" step="1" {...register('minimumStockLevel')} /><FormField label="Purchase Date (optional)" error={errors.purchaseDate?.message} type="date" {...register('purchaseDate')} /><FormField label="Barcode (optional)" error={errors.barcode?.message} {...register('barcode')} /></div><label className="block text-sm font-medium text-slate-700">Description (optional)<textarea rows={4} {...register('description')} className="input" /></label>{errors.description && <p className="-mt-4 text-xs text-red-600">{errors.description.message}</p>}<label className="flex w-fit items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" {...register('isActive')} /> Active product</label>{serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}<div className="flex justify-end"><button disabled={isSubmitting} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Saving…' : submitLabel}</button></div></form>;
};
