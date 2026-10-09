export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'MEDICAL_HALF_DAY' | 'LEAVE';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  userId: string;
  attendanceDate: string;
  status: AttendanceStatus;
  clockIn?: string;
  clockOut?: string;
  totalMinutes: number;
  source: 'SELF' | 'ADMIN' | 'LEAVE_REQUEST';
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentAttendanceResponse {
  attendanceDate: string;
  state: 'NOT_CLOCKED_IN' | 'CLOCKED_IN' | 'CLOCKED_OUT' | 'RECORDED';
  attendance: AttendanceRecord | null;
  elapsedMinutes: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface LeaveRequestResponse {
  requests: LeaveRequest[];
  pagination: AttendanceHistoryResponse['pagination'];
}

export interface AttendanceRecordInput {
  employeeId: string;
  attendanceDate: string;
  status: AttendanceStatus;
  reason?: string;
}

export interface AttendanceHistoryResponse {
  attendance: AttendanceRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AttendanceListInput {
  page: number;
  limit?: number;
  from: string;
  to: string;
  employeeId?: string;
  status?: AttendanceStatus;
}
