import { api } from '../../lib/api';
import type { AttendanceHistoryResponse, AttendanceListInput, AttendanceRecord, AttendanceRecordInput, CurrentAttendanceResponse, LeaveRequest, LeaveRequestResponse } from './types';

export const getCurrentAttendance = async (): Promise<CurrentAttendanceResponse> =>
  (await api.get<CurrentAttendanceResponse>('/attendance/me/current')).data;

export const clockIn = async (): Promise<AttendanceRecord> =>
  (await api.post<{ attendance: AttendanceRecord }>('/attendance/clock-in')).data.attendance;

export const clockOut = async (): Promise<AttendanceRecord> =>
  (await api.post<{ attendance: AttendanceRecord }>('/attendance/clock-out')).data.attendance;

export const getMyAttendanceHistory = async (page: number): Promise<AttendanceHistoryResponse> =>
  (await api.get<AttendanceHistoryResponse>('/attendance/me/history', { params: { page, limit: 10 } })).data;

export const getAttendance = async (input: AttendanceListInput): Promise<AttendanceHistoryResponse> =>
  (await api.get<AttendanceHistoryResponse>('/attendance', { params: { ...input, limit: input.limit ?? 20, employeeId: input.employeeId || undefined, status: input.status || undefined } })).data;

export const recordAttendance = async (input: AttendanceRecordInput): Promise<AttendanceRecord> =>
  (await api.put<{ attendance: AttendanceRecord }>('/attendance/record', input)).data.attendance;

export const requestLeave = async (input: { startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> =>
  (await api.post<{ request: LeaveRequest }>('/attendance/me/leave-requests', input)).data.request;

export const getMyLeaveRequests = async (page: number): Promise<LeaveRequestResponse> =>
  (await api.get<LeaveRequestResponse>('/attendance/me/leave-requests', { params: { page, limit: 10 } })).data;

export const getLeaveRequests = async (page: number, status?: LeaveRequest['status']): Promise<LeaveRequestResponse> =>
  (await api.get<LeaveRequestResponse>('/attendance/leave-requests', { params: { page, limit: 10, status } })).data;

export const reviewLeaveRequest = async (id: string, input: { status: 'APPROVED' | 'REJECTED'; reviewNote?: string }): Promise<LeaveRequest> =>
  (await api.post<{ request: LeaveRequest }>(`/attendance/leave-requests/${id}/review`, input)).data.request;
