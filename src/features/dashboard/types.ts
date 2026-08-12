export type DashboardOverview = {
  range: { from: string; to: string; };
  today: { revenue: number; bills: number; customersServed: number; servicesPerformed: number; serviceRevenue: number; productsSold: number; productRevenue: number; };
  revenueSummary: { revenue: number; bills: number; averageBillValue: number; };
  revenueTrend: { date: string; revenue: number; bills: number; }[];
  paymentMethods: { method: 'CASH' | 'UPI' | 'CARD' | 'MIXED'; amount: number; percentage: number; }[];
  topServices: { id: string; name: string; quantity: number; revenue: number; }[];
  topProducts: { id: string; name: string; quantity: number; revenue: number; }[];
  employeePerformance: { id: string; name: string; servicesPerformed: number; revenue: number; customersServed: number; }[];
  recentBills: { id: string; invoiceNumber: string; customerName: string; customerMobile?: string; grandTotal: number; paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'; paymentMethods: string[]; createdAt: string; }[];
  lowStock: { count: number; products: { id: string; name: string; currentStock: number; minimumStockLevel: number; }[]; };
};
