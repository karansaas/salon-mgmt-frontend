export type ClientGender = 'Male' | 'Female' | 'Other';

export interface Client {
  id: string;
  firstName: string;
  lastName?: string;
  mobileNumber?: string;
  gender?: ClientGender;
  dateOfBirth?: string;
  email?: string;
  address?: string;
  notes?: string;
  preferredEmployee?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInput {
  firstName: string;
  lastName?: string;
  mobileNumber?: string;
  gender?: ClientGender;
  dateOfBirth?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface ClientListResponse {
  clients: Client[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export interface ClientHistory {
  visitHistory: unknown[];
  billingHistory: unknown[];
  servicesAvailed: unknown[];
  productsPurchased: unknown[];
  totalAmountSpent: number;
  lastVisitDate: string | null;
  preferredEmployee: string | null;
}
