export const SERVICE_CATEGORIES = ['Haircut', 'Hair Color', 'Hair Treatment', 'Facial', 'Makeup', 'Waxing', 'Threading', 'Manicure', 'Pedicure', 'Spa', 'Massage', 'Other'] as const;
export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
export interface Service { id: string; name: string; category: ServiceCategory; description?: string; duration: number; price: number; isActive: boolean; createdAt: string; updatedAt: string; }
export interface ServiceInput { name: string; category: ServiceCategory; description?: string; duration: number; price: number; isActive: boolean; }
export interface ServiceListResponse { services: Service[]; pagination: { page: number; limit: number; total: number; totalPages: number; }; }
