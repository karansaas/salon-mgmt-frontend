export const PRODUCT_CATEGORIES = ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Color', 'Skin Care', 'Facial Kit', 'Makeup', 'Wax', 'Nail Care', 'Spa Products', 'Accessories', 'Other'] as const;
export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductType = 'RETAIL' | 'PROFESSIONAL';
export interface Product { id: string; name: string; productType: ProductType; category: ProductCategory; brand?: string; description?: string; purchasePrice: number; sellingPrice: number; currentStock: number; minimumStockLevel: number; purchaseDate?: string; sku?: string; barcode?: string; isActive: boolean; createdAt: string; updatedAt: string; }
export interface ProductInput { name: string; productType: ProductType; category: ProductCategory; brand?: string; description?: string; purchasePrice: number; sellingPrice: number; currentStock: number; minimumStockLevel: number; purchaseDate?: string; sku?: string; barcode?: string; isActive: boolean; }
export interface ProductListResponse { products: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number; }; }
export interface StockItem { id: string; action: string; quantity: number; previousStock: number; newStock: number; remarks: string; invoiceNumber?: string; invoiceId?: string; createdAt: string; }
export interface ProductHistory { product: Product; stockHistory: StockItem[]; currentStock: number; totalAdjustments: number; sales: { totalUnitsSold: number; revenueGenerated: number; lastSaleDate: string | null; }; }
