export interface Employee {
  code: string;
  name: string;
  area: string;
  agency: string;
}

export interface AttendanceRecord {
  employeeCode: string;
  type: 'Entrada' | 'Salida';
  observation?: string;
  timestamp: string;
  date: string;
}

export interface AdminState {
  isLoggedIn: boolean;
}