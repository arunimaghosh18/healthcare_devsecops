
export interface User {
  id: string;
  role: "patient" | "doctor" | "admin";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Patient extends User {
  role: "patient";
  dateOfBirth: string;
  bloodGroup: string;
  phoneNumber: string;
  appointments: string[];
}

export interface Doctor extends User {
  role: "doctor";
  dateOfBirth: string;
  phoneNumber: string;
  licenseNumber: string;
  specialization: string;
  appointments: string[];
  unavailableDates: Array<{
    startDate: string;
    endDate: string;
    reason: string;
  }>;
}

export interface Admin extends User {
  role: "admin";
  accessLevel: "full" | "limited";
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  timeSlot: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
