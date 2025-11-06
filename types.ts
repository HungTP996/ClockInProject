
export enum PunchType {
  ClockIn = 'clockIn',
  ClockOut = 'clockOut',
}

export interface Punch {
  type: PunchType;
  time: Date;
}

// FIX: Add startDate and endDate to the Leave interface to properly type leave requests.
export interface Leave {
  reason: string;
  leaveType: string;
  status: 'pending' | 'approved' | 'rejected';
  employeeId: string;
  name: string;
  startDate: string;
  endDate?: string;
}

export interface UserProfile {
  name: string;
  employeeId: string;
  password: string;
  role: 'admin' | 'user';
  creationDate: string;
}

export enum IncidentType {
  MissedClockOut = 'missedClockOut',
}

export interface WorkIncident {
  id: string; // e.g., 'incident-USER001-2025-11-20'
  type: IncidentType;
  date: string; // YYYY-MM-DD
  status: 'pending_correction' | 'pending_approval' | 'resolved' | 'rejected';
  requestedTime?: string; // ISO string for requested clock-out time
  employeeId: string;
  name: string;
}