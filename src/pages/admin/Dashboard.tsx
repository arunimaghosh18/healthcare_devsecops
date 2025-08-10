import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getPatients, getDoctors, getAppointments, getAdmins,
  deletePatient, deleteDoctor, deleteAppointment, getCurrentUser, 
  updateAppointmentStatus, deleteAdmin
} from '@/lib/data';
import { Patient, Doctor, Appointment, Admin } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, Clock, User, UserCheck, UserX, Users, CalendarDays, 
  Shield, MoreVertical, Search, FileX, RefreshCw, Check, X, Edit, Trash, 
  UserPlus, CheckCircle, AlertTriangle, Ban
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    
    setCurrentAdmin(user as Admin);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setPatients(getPatients());
    setDoctors(getDoctors());
    setAppointments(getAppointments());
    setAdmins(getAdmins());
  };

  const handleDeletePatient = (id: string) => {
    try {
      const success = deletePatient(id);
      if (success) {
        toast({
          title: 'Patient deleted',
          description: 'Patient has been successfully deleted',
        });
        refreshData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete patient',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDoctor = (id: string) => {
    try {
      const success = deleteDoctor(id);
      if (success) {
        toast({
          title: 'Doctor deleted',
          description: 'Doctor has been successfully deleted',
        });
        refreshData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete doctor',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAppointment = (id: string) => {
    try {
      const success = deleteAppointment(id);
      if (success) {
        toast({
          title: 'Appointment deleted',
          description: 'Appointment has been successfully deleted',
        });
        refreshData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete appointment',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    try {
      const updated = updateAppointmentStatus(id, status);
      if (updated) {
        toast({
          title: 'Status updated',
          description: `Appointment status changed to ${status}`,
        });
        refreshData();
        setSelectedAppointment(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const filteredPatients = patients.filter(patient => {
    const searchString = `${patient.firstName} ${patient.lastName} ${patient.email} ${patient.phoneNumber}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const filteredDoctors = doctors.filter(doctor => {
    const searchString = `${doctor.firstName} ${doctor.lastName} ${doctor.email} ${doctor.specialization} ${doctor.phoneNumber}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const filteredAppointments = appointments
    .filter(appointment => {
      const searchString = `${appointment.patientName} ${appointment.doctorName} ${appointment.specialization}`.toLowerCase();
      const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
      return searchString.includes(searchTerm.toLowerCase()) && statusMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredAdmins = admins.filter(admin => {
    const searchString = `${admin.firstName} ${admin.lastName} ${admin.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getCurrentItems = () => {
    switch (currentTab) {
      case 'patients':
        return getPaginatedData(filteredPatients, currentPage);
      case 'doctors':
        return getPaginatedData(filteredDoctors, currentPage);
      case 'appointments':
        return getPaginatedData(filteredAppointments, currentPage);
      case 'admins':
        return getPaginatedData(filteredAdmins, currentPage);
      default:
        return [];
    }
  };

  const getTotalPages = () => {
    let totalItems;
    switch (currentTab) {
      case 'patients':
        totalItems = filteredPatients.length;
        break;
      case 'doctors':
        totalItems = filteredDoctors.length;
        break;
      case 'appointments':
        totalItems = filteredAppointments.length;
        break;
      case 'admins':
        totalItems = filteredAdmins.length;
        break;
      default:
        totalItems = 0;
    }
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-4">
        <header className="mb-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="mr-2 h-8 w-8 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {currentAdmin?.firstName} {currentAdmin?.lastName}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/profile')}
                className="flex items-center"
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => {
                  navigate('/');
                  window.location.reload();
                }}
                className="flex items-center"
              >
                <UserX className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="w-full flex justify-between items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>
        
        <Tabs 
          defaultValue="overview" 
          onValueChange={(value) => {
            setCurrentTab(value);
            setCurrentPage(1);
            setSearchTerm('');
            setStatusFilter('all');
          }}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 max-w-4xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center">
              <User className="h-4 w-4 mr-2" /> Patients
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" /> Doctors
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Appointments
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Admins
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" /> 
                      Patients
                    </CardTitle>
                    <CardDescription>Total registered patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{patients.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-green-500" /> 
                      Doctors
                    </CardTitle>
                    <CardDescription>Total registered doctors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{doctors.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-violet-500" /> 
                      Appointments
                    </CardTitle>
                    <CardDescription>Total appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{appointments.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-orange-500" /> 
                      Active Appointments
                    </CardTitle>
                    <CardDescription>Upcoming appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" /> 
                      Recent Appointments
                    </CardTitle>
                    <CardDescription>Latest 5 appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointments
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>{appointment.patientName}</TableCell>
                                <TableCell>{appointment.doctorName}</TableCell>
                                <TableCell>
                                  {new Date(appointment.date).toLocaleDateString()} {appointment.timeSlot}
                                </TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <FileX className="h-8 w-8 mb-2" />
                        <p>No appointments found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-500" /> 
                      Recent Registrations
                    </CardTitle>
                    <CardDescription>Latest 5 user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {[...patients, ...doctors]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Registered</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...patients, ...doctors]
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .slice(0, 5)
                              .map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    {user.role === 'patient' ? (
                                      <Badge className="bg-blue-500">Patient</Badge>
                                    ) : (
                                      <Badge className="bg-green-500">Doctor</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                          <FileX className="h-8 w-8 mb-2" />
                          <p>No recent registrations</p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" /> 
                  Patients Management
                </CardTitle>
                <CardDescription>
                  View and manage all registered patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getPaginatedData(filteredPatients, currentPage).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Appointments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(filteredPatients, currentPage).map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                  {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {patient.firstName} {patient.lastName}
                            </div>
                          </TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phoneNumber}</TableCell>
                          <TableCell>{patient.bloodGroup}</TableCell>
                          <TableCell>{patient.dateOfBirth}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500">
                              {patient.appointments.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Appointments
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete Patient
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Patient</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this patient? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm text-gray-500">
                                    Patient: <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Email: <span className="font-semibold">{patient.email}</span>
                                  </p>
                                  <p className="text-sm text-red-500 mt-2 font-semibold">
                                    This will also delete all associated appointments.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleDeletePatient(patient.id)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    {searchTerm ? (
                      <>
                        <Search className="h-10 w-10 mb-2" />
                        <p>No patients found matching "{searchTerm}"</p>
                      </>
                    ) : (
                      <>
                        <FileX className="h-10 w-10 mb-2" />
                        <p>No patients registered yet</p>
                      </>
                    )}
                  </div>
                )}
                
                {renderPagination()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-green-500" /> 
                  Doctors Management
                </CardTitle>
                <CardDescription>
                  View and manage all registered doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getPaginatedData(filteredDoctors, currentPage).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>License Number</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Appointments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(filteredDoctors, currentPage).map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-green-100 text-green-800">
                                  {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </div>
                          </TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-500">
                              {doctor.specialization}
                            </Badge>
                          </TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>{doctor.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500">
                              {doctor.appointments.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Appointments
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete Doctor
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Doctor</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this doctor? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm text-gray-500">
                                    Doctor: <span className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</span>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Specialization: <span className="font-semibold">{doctor.specialization}</span>
                                  </p>
                                  <p className="text-sm text-red-500 mt-2 font-semibold">
                                    This will cancel all associated appointments.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleDeleteDoctor(doctor.id)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    {searchTerm ? (
                      <>
                        <Search className="h-10 w-10 mb-2" />
                        <p>No doctors found matching "{searchTerm}"</p>
                      </>
                    ) : (
                      <>
                        <FileX className="h-10 w-10 mb-2" />
                        <p>No doctors registered yet</p>
                      </>
                    )}
                  </div>
                )}
                
                {renderPagination()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-violet-500" /> 
                      Appointments Management
                    </CardTitle>
                    <CardDescription>
                      View and manage all appointments
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Label htmlFor="status-filter" className="mr-2">Status:</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger id="status-filter" className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getPaginatedData(filteredAppointments, currentPage).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(filteredAppointments, currentPage).map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.patientName}</TableCell>
                          <TableCell>{appointment.doctorName}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-500">
                              {appointment.specialization}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center text-gray-500 text-xs mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {appointment.timeSlot}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                          <TableCell>
                            {new Date(appointment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Appointment Details</DialogTitle>
                                  <DialogDescription>
                                    View and manage appointment information
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm text-gray-500">Patient</Label>
                                      <p className="font-semibold">
                                        {appointment.patientName}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm text-gray-500">Doctor</Label>
                                      <p className="font-semibold">
                                        {appointment.doctorName}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm text-gray-500">Date</Label>
                                      <p className="font-semibold">
                                        {new Date(appointment.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm text-gray-500">Time</Label>
                                      <p className="font-semibold">
                                        {appointment.timeSlot}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm text-gray-500">Specialization</Label>
                                    <p className="font-semibold">
                                      {appointment.specialization}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm text-gray-500">Symptoms</Label>
                                    <p className="font-semibold">
                                      {appointment.symptoms || "No symptoms provided"}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm text-gray-500">Current Status</Label>
                                    <p className="font-semibold mt-1">
                                      {getStatusBadge(appointment.status)}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm text-gray-500">Change Status</Label>
                                    <div className="flex gap-2 mt-2">
                                      <Button 
                                        size="sm" 
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                        disabled={appointment.status === 'confirmed'}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Confirm
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                                        disabled={appointment.status === 'completed'}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Complete
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                                        disabled={appointment.status === 'cancelled'}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleDeleteAppointment(appointment.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete Appointment
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? (
                      <>
                        <Search className="h-10 w-10 mb-2" />
                        <p>No appointments found matching your filters</p>
                      </>
                    ) : (
                      <>
                        <FileX className="h-10 w-10 mb-2" />
                        <p>No appointments scheduled yet</p>
                      </>
                    )}
                  </div>
                )}
                
                {renderPagination()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-500" /> 
                      Administrators Management
                    </CardTitle>
                    <CardDescription>
                      View and manage system administrators
                    </CardDescription>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Link to="/admin/register">
                      <Button className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Admin
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getPaginatedData(filteredAdmins, currentPage).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(filteredAdmins, currentPage).map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                  {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {admin.firstName} {admin.lastName}
                              {currentAdmin?.id === admin.id && (
                                <Badge variant="outline" className="ml-2">You</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>
                            {admin.accessLevel === 'full' ? (
                              <Badge className="bg-purple-500">Full Access</Badge>
                            ) : (
                              <Badge className="bg-blue-500">Limited Access</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  {admins.length > 1 && currentAdmin?.id !== admin.id && (
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete Admin
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              {admins.length > 1 && currentAdmin?.id !== admin.id && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Administrator</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this admin account? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p className="text-sm text-gray-500">
                                      Admin: <span className="font-semibold">{admin.firstName} {admin.lastName}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Email: <span className="font-semibold">{admin.email}</span>
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => {
                                        try {
                                          const success = deleteAdmin(admin.id);
                                          if (success) {
                                            toast({
                                              title: 'Admin deleted',
                                              description: 'Admin account has been successfully deleted',
                                            });
                                            refreshData();
                                          }
                                        } catch (error) {
                                          toast({
                                            title: 'Error',
                                            description: error instanceof Error ? error.message : 'Failed to delete admin',
                                            variant: 'destructive',
                                          });
                                        }
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              )}
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    {searchTerm ? (
                      <>
                        <Search className="h-10 w-10 mb-2" />
                        <p>No admins found matching "{searchTerm}"</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-10 w-10 mb-2" />
                        <p>No administrators found</p>
                      </>
                    )}
                  </div>
                )}
                
                {renderPagination()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
