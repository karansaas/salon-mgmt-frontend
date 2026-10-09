export type PayrollStatus = 'DRAFT' | 'RELEASED';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleStart: string;
  cycleEnd: string;
  releaseDate: string;
  monthlySalary: number;
  cycleDays: number;
  eligibleDays: number;
  presentDays: number;
  halfDays: number;
  medicalHalfDays: number;
  absentDays: number;
  leaveDays: number;
  paidLeaveDays: number;
  excessLeaveDays: number;
  leavePenaltyDays: number;
  paidDays: number;
  dailyRate: number;
  deductionAmount: number;
  payableAmount: number;
  status: PayrollStatus;
  releasedAt?: string;
  releasedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollResponse {
  cycle: { key: string; start: string; end: string; releaseDate: string };
  payroll: PayrollRecord[];
  summary?: { employees: number; released: number; totalPayable: number };
}
