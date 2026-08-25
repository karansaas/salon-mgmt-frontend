import { api } from '../../lib/api'; import type { Product, ProductHistory, ProductInput, ProductListResponse, ProductType } from './types';
export const getProducts = async (params: { page: number; search: string; category: string; brand: string; status: string; productType?: ProductType }): Promise<ProductListResponse> => (await api.get<ProductListResponse>('/products', { params: { ...params, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', category: params.category || undefined, brand: params.brand || undefined, productType: params.productType ?? 'RETAIL' } })).data;
export const getProduct = async (id: string): Promise<Product> => (await api.get<{ product: Product }>(`/products/${id}`)).data.product;
export const createProduct = async (data: ProductInput): Promise<Product> => (await api.post<{ product: Product }>('/products', data)).data.product;
export const updateProduct = async ({ id, data }: { id: string; data: ProductInput }): Promise<Product> => (await api.put<{ product: Product }>(`/products/${id}`, data)).data.product;
export const deleteProduct = async (id: string): Promise<void> => { await api.delete(`/products/${id}`); };
export const getProductHistory = async (id: string): Promise<ProductHistory> => (await api.get<ProductHistory>(`/products/${id}/history`)).data;
export const adjustStock = async ({ id, mode, quantity, remarks }: { id: string; mode: 'add' | 'remove' | 'set'; quantity: number; remarks: string }): Promise<Product> => (await api.post<{ product: Product }>(`/products/${id}/stock`, { mode, quantity, remarks })).data.product;
export const getLowStockProducts = async (productType: ProductType = 'RETAIL'): Promise<Product[]> => (await api.get<{ products: Product[] }>('/products/low-stock', { params: { productType } })).data.products;
