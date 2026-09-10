import { api } from '../../lib/api';
import type { AttendanceHistoryResponse, AttendanceListInput, AttendanceRecord, CurrentAttendanceResponse } from './types';

export const getCurrentAttendance = async (): Promise<CurrentAttendanceResponse> =>
  (await api.get<CurrentAttendanceResponse>('/attendance/me/current')).data;

export const clockIn = async (): Promise<AttendanceRecord> =>
  (await api.post<{ attendance: AttendanceRecord }>('/attendance/clock-in')).data.attendance;

export const clockOut = async (): Promise<AttendanceRecord> =>
  (await api.post<{ attendance: AttendanceRecord }>('/attendance/clock-out')).data.attendance;

export const getMyAttendanceHistory = async (page: number): Promise<AttendanceHistoryResponse> =>
  (await api.get<AttendanceHistoryResponse>('/attendance/me/history', { params: { page, limit: 10 } })).data;

export const getAttendance = async (input: AttendanceListInput): Promise<AttendanceHistoryResponse> =>
  (await api.get<AttendanceHistoryResponse>('/attendance', { params: { ...input, limit: 20, employeeId: input.employeeId || undefined, status: input.status || undefined } })).data;
