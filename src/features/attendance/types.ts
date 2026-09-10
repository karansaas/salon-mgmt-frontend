export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  userId: string;
  attendanceDate: string;
  status: AttendanceStatus;
  clockIn: string;
  clockOut?: string;
  totalMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentAttendanceResponse {
  attendanceDate: string;
  state: 'NOT_CLOCKED_IN' | 'CLOCKED_IN' | 'CLOCKED_OUT';
  attendance: AttendanceRecord | null;
  elapsedMinutes: number;
}

export interface AttendanceHistoryResponse {
  attendance: AttendanceRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AttendanceListInput {
  page: number;
  from: string;
  to: string;
  employeeId?: string;
  status?: AttendanceStatus;
}
