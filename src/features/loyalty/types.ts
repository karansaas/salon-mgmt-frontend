export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUSTMENT';

export interface LoyaltyTransaction {
  id: string;
  type: LoyaltyTransactionType;
  points: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
  billId?: string;
  invoiceNumber?: string;
  createdBy?: string;
}

export interface ClientLoyaltyResponse {
  clientId: string;
  account: {
    pointsBalance: number;
    lifetimeEarned: number;
    lifetimeRedeemed: number;
    totalAdjusted: number;
  };
  config: {
    spendPerPoint: number;
    minimumRedemptionPoints: number;
    redemptionPoints: number;
    redemptionValue: number;
  };
  transactions: LoyaltyTransaction[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface LoyaltyAdjustmentInput {
  points: number;
  reason: string;
}
