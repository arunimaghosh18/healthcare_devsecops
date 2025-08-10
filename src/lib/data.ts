
import {
  User,
  Patient,
  Doctor,
  Admin,
  Appointment,
  TimeSlot,
} from "@/types";

// Mock data storage
const users: User[] = [
  {
    id: "admin1",
    role: "admin",
    email: "admin@example.com",
    password: "admin",
    firstName: "Admin",
    lastName: "User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "patient1",
    role: "patient",
    email: "patient1@example.com",
    password: "password1",
    firstName: "Alice",
    lastName: "Smith",
    createdAt: new Date().toISOString(),
  },
  {
    id: "patient2",
    role: "patient",
    email: "patient2@example.com",
    password: "password2",
    firstName: "Bob",
    lastName: "Johnson",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doctor1",
    role: "doctor",
    email: "doctor1@example.com",
    password: "password3",
    firstName: "Charlie",
    lastName: "Williams",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doctor2",
    role: "doctor",
    email: "doctor2@example.com",
    password: "password4",
    firstName: "Diana",
    lastName: "Brown",
    createdAt: new Date().toISOString(),
  },
];

const patients: Patient[] = [
  {
    id: "patient1",
    role: "patient",
    email: "patient1@example.com",
    password: "password1",
    firstName: "Alice",
    lastName: "Smith",
    dateOfBirth: "1990-05-15",
    bloodGroup: "A+",
    phoneNumber: "123-456-7890",
    appointments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "patient2",
    role: "patient",
    email: "patient2@example.com",
    password: "password2",
    firstName: "Bob",
    lastName: "Johnson",
    dateOfBirth: "1985-12-20",
    bloodGroup: "B-",
    phoneNumber: "987-654-3210",
    appointments: [],
    createdAt: new Date().toISOString(),
  },
];

const doctors: Doctor[] = [
  {
    id: "doctor1",
    role: "doctor",
    email: "doctor1@example.com",
    password: "password3",
    firstName: "Charlie",
    lastName: "Williams",
    dateOfBirth: "1978-08-03",
    phoneNumber: "555-123-4567",
    licenseNumber: "MD12345",
    specialization: "Cardiology",
    appointments: [],
    unavailableDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "doctor2",
    role: "doctor",
    email: "doctor2@example.com",
    password: "password4",
    firstName: "Diana",
    lastName: "Brown",
    dateOfBirth: "1982-02-10",
    phoneNumber: "555-987-6543",
    licenseNumber: "MD67890",
    specialization: "Dermatology",
    appointments: [],
    unavailableDates: [],
    createdAt: new Date().toISOString(),
  },
];

const admins: Admin[] = [
  {
    id: "admin1",
    role: "admin",
    email: "admin@example.com",
    password: "admin",
    firstName: "Admin",
    lastName: "User",
    accessLevel: "full",
    createdAt: new Date().toISOString(),
  },
];

const appointments: Appointment[] = [
  {
    id: "appointment1",
    patientId: "patient1",
    doctorId: "doctor1",
    patientName: "Alice Smith",
    doctorName: "Charlie Williams",
    specialization: "Cardiology",
    date: "2024-07-10",
    timeSlot: "10:00 AM",
    status: "confirmed",
    symptoms: "Chest pain and shortness of breath",
    diagnosis: "Possible angina",
    prescription: "Rest and consult a cardiologist",
    createdAt: new Date().toISOString(),
  },
  {
    id: "appointment2",
    patientId: "patient2",
    doctorId: "doctor2",
    patientName: "Bob Johnson",
    doctorName: "Diana Brown",
    specialization: "Dermatology",
    date: "2024-07-12",
    timeSlot: "02:00 PM",
    status: "pending",
    symptoms: "Rash on arms and face",
    createdAt: new Date().toISOString(),
  },
];

// Function to get all users
export const getAllUsers = (): User[] => {
  return users;
};

// Function to get all patients
export const getAllPatients = (): Patient[] => {
  return patients;
};

// Function to get all doctors
export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

// Function to get all admins
export const getAllAdmins = (): Admin[] => {
  return admins;
};

// Function to get all appointments
export const getAllAppointments = (): Appointment[] => {
  return appointments;
};

// Aliases for error correction
export const getPatients = getAllPatients;
export const getDoctors = getAllDoctors;
export const getAdmins = getAllAdmins;
export const getAppointments = getAllAppointments;

// Function to validate user credentials
export const validateUserCredentials = (
  email: string,
  password: string
): User | undefined => {
  return users.find(
    (user) => user.email === email && user.password === password
  );
};

// Login function 
export const login = (
  email: string, 
  password: string, 
  role: "patient" | "doctor" | "admin"
): User | undefined => {
  // Find the user with matching email and password
  const user = users.find(
    (user) => user.email === email && user.password === password && user.role === role
  );
  
  if (user) {
    // Store user in localStorage for session management
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  
  return undefined;
};

// Function to validate admin credentials
export const validateAdminCredentials = (
  email: string,
  password: string
): Admin | undefined => {
  return admins.find(
    (admin) => admin.email === email && admin.password === password
  );
};

// Function to register a new user
export const registerUser = (
  role: "patient" | "doctor" | "admin",
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth?: string,
  phoneNumber?: string,
  licenseNumber?: string,
  specialization?: string
): User => {
  const newUser: User = {
    id: `user-${Date.now()}`,
    role,
    email,
    password,
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  if (role === "patient") {
    const newPatient: Patient = {
      ...newUser,
      role: "patient",
      dateOfBirth: dateOfBirth || "",
      bloodGroup: "Not specified",
      phoneNumber: phoneNumber || "",
      appointments: [],
    };
    patients.push(newPatient);
    return newPatient;
  } else if (role === "doctor") {
    const newDoctor: Doctor = {
      ...newUser,
      role: "doctor",
      dateOfBirth: dateOfBirth || "",
      phoneNumber: phoneNumber || "",
      licenseNumber: licenseNumber || "",
      specialization: specialization || "",
      appointments: [],
      unavailableDates: [],
    };
    doctors.push(newDoctor);
    return newDoctor;
  } else if (role === "admin") {
    const newAdmin: Admin = {
      ...newUser,
      role: "admin",
      accessLevel: "limited",
    };
    admins.push(newAdmin);
    return newAdmin;
  }

  return newUser;
};

// Additional functions needed by the application
export const createPatient = registerUser;
export const createDoctor = registerUser;
export const createAdmin = registerUser;

export const updatePatient = (patientId: string, data: Partial<Patient>): Patient | undefined => {
  return updatePatientProfile(patientId, data);
};

export const updateDoctor = (doctorId: string, data: Partial<Doctor>): Doctor | undefined => {
  return updateDoctorProfile(doctorId, data);
};

export const updateAdmin = (adminId: string, data: Partial<Admin>): Admin | undefined => {
  return updateAdminProfile(adminId, data);
};

// Function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

// Function to get a patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

// Function to get a doctor by ID
export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id);
};

// Function to get an admin by ID
export const getAdminById = (id: string): Admin | undefined => {
  return admins.find((admin) => admin.id === id);
};

// Function to get current user from local storage
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

// Function to create a new appointment
export const createAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const newAppointment: Appointment = {
    id: `appointment-${Date.now()}`,
    ...appointment,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  return newAppointment;
};

// Function to get an appointment by ID
export const getAppointmentById = (id: string): Appointment | undefined => {
  return appointments.find((appointment) => appointment.id === id);
};

// Function to update appointment status
export const updateAppointmentStatus = (
  appointmentId: string, 
  status: "confirmed" | "pending" | "cancelled" | "completed",
  diagnosis?: string,
  prescription?: string
): Appointment | undefined => {
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
  if (appointmentIndex === -1) return undefined;
  
  const updatedAppointment = { 
    ...appointments[appointmentIndex],
    status,
    ...(diagnosis ? { diagnosis } : {}),
    ...(prescription ? { prescription } : {})
  };
  
  appointments[appointmentIndex] = updatedAppointment;
  return updatedAppointment;
};

// Function to delete various entities
export const deletePatient = (id: string): boolean => {
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients.splice(index, 1);
    return true;
  }
  return false;
};

export const deleteDoctor = (id: string): boolean => {
  const index = doctors.findIndex(d => d.id === id);
  if (index !== -1) {
    doctors.splice(index, 1);
    return true;
  }
  return false;
};

export const deleteAdmin = (id: string): boolean => {
  const index = admins.findIndex(a => a.id === id);
  if (index !== -1) {
    admins.splice(index, 1);
    return true;
  }
  return false;
};

export const deleteAppointment = (id: string): boolean => {
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments.splice(index, 1);
    return true;
  }
  return false;
};

// Function to get appointments by patient ID
export const getAppointmentsByPatientId = (patientId: string): Appointment[] => {
  return appointments.filter((appointment) => appointment.patientId === patientId);
};

// Function to get appointments by doctor ID
export const getAppointmentsByDoctorId = (doctorId: string): Appointment[] => {
  return appointments.filter((appointment) => appointment.doctorId === doctorId);
};

// Doctor availability functions
export const isDoctorAvailable = (doctorId: string, date: string): boolean => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return false;
  
  // Check if date is in doctor's unavailable dates
  return !doctor.unavailableDates.some(unavailable => {
    const selectedDate = new Date(date);
    const startDate = new Date(unavailable.startDate);
    const endDate = new Date(unavailable.endDate);
    return selectedDate >= startDate && selectedDate <= endDate;
  });
};

export const addDoctorUnavailability = (
  doctorId: string, 
  startDate: string, 
  endDate: string, 
  reason: string
): Doctor | undefined => {
  const doctorIndex = doctors.findIndex(d => d.id === doctorId);
  if (doctorIndex === -1) return undefined;
  
  doctors[doctorIndex].unavailableDates.push({
    startDate,
    endDate,
    reason
  });
  
  return doctors[doctorIndex];
};

export const deleteDoctorUnavailability = (
  doctorId: string, 
  startDate: string, 
  endDate: string
): Doctor | undefined => {
  const doctorIndex = doctors.findIndex(d => d.id === doctorId);
  if (doctorIndex === -1) return undefined;
  
  const updatedUnavailableDates = doctors[doctorIndex].unavailableDates
    .filter(d => !(d.startDate === startDate && d.endDate === endDate));
  
  doctors[doctorIndex].unavailableDates = updatedUnavailableDates;
  return doctors[doctorIndex];
};

// Function to get available doctors based on date and specialization
export const getAvailableDoctors = (date: string, specialization: string): Doctor[] => {
  // Filter doctors by specialization
  const filteredDoctors = doctors.filter(doctor => doctor.specialization === specialization);

  // Further filter doctors based on availability (excluding unavailable dates)
  const availableDoctors = filteredDoctors.filter(doctor => {
    return doctor.unavailableDates.every(unavailable => {
      const selectedDate = new Date(date);
      const startDate = new Date(unavailable.startDate);
      const endDate = new Date(unavailable.endDate);
      return !(selectedDate >= startDate && selectedDate <= endDate);
    });
  });

  return availableDoctors;
};

// Function to get available time slots for a doctor on a specific date
export const getAvailableTimeSlots = (doctorId: string, date: string): string[] => {
  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === doctorId && appointment.date === date
  );

  const bookedTimeSlots = doctorAppointments.map((appointment) => appointment.timeSlot);

  // Define all possible time slots
  const allTimeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  ];

  // Filter out the booked time slots
  const availableTimeSlots = allTimeSlots.filter((timeSlot) => !bookedTimeSlots.includes(timeSlot));

  return availableTimeSlots;
};

// Function to get all specializations
export const getAllSpecializations = (): string[] => {
  return [...new Set(doctors.map((doctor) => doctor.specialization))];
};

// Function to get doctors by specialization
export const getDoctorsBySpecialization = (specialization: string): Doctor[] => {
  return doctors.filter((doctor) => doctor.specialization === specialization);
};

// Function to update patient profile
export const updatePatientProfile = (
  patientId: string,
  updates: Partial<Patient>
): Patient | undefined => {
  const patientIndex = patients.findIndex((patient) => patient.id === patientId);
  if (patientIndex === -1) {
    return undefined;
  }

  patients[patientIndex] = { ...patients[patientIndex], ...updates };
  return patients[patientIndex];
};

// Function to update doctor profile
export const updateDoctorProfile = (
  doctorId: string,
  updates: Partial<Doctor>
): Doctor | undefined => {
  const doctorIndex = doctors.findIndex((doctor) => doctor.id === doctorId);
  if (doctorIndex === -1) {
    return undefined;
  }

  doctors[doctorIndex] = { ...doctors[doctorIndex], ...updates };
  return doctors[doctorIndex];
};

// Function to update admin profile
export const updateAdminProfile = (
  adminId: string,
  updates: Partial<Admin>
): Admin | undefined => {
  const adminIndex = admins.findIndex((admin) => admin.id === adminId);
  if (adminIndex === -1) {
    return undefined;
  }

  admins[adminIndex] = { ...admins[adminIndex], ...updates };
  return admins[adminIndex];
};
