
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAppointmentsByPatientId, getCurrentUser, getPatientById } from '@/lib/data';
import { Appointment, Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CalendarClock, UserRound, ChevronRight, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PatientDashboard = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'patient') {
      navigate('/patient/login');
      return;
    }
    
    setPatient(user as Patient);
    const fetchedAppointments = getAppointmentsByPatientId(user.id);
    setAppointments(fetchedAppointments);
  }, [navigate]);

  const upcomingAppointments = appointments.filter(
    app => app.status === 'confirmed' || app.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === 'completed' || app.status === 'cancelled'
  );

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome back, {patient.firstName} {patient.lastName}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex space-x-2 mt-4 md:mt-0"
          >
            <Button asChild variant="outline">
              <Link to="/patient/profile">
                <UserRound className="h-4 w-4 mr-2" />
                My Profile
              </Link>
            </Button>
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/patient/book-appointment">
                <CalendarClock className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Full Name</div>
                  <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="font-medium">{patient.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Phone Number</div>
                  <div className="font-medium">{patient.phoneNumber}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Date of Birth</div>
                  <div className="font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Blood Group</div>
                  <div className="font-medium">{patient.bloodGroup}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>View and manage your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="upcoming"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                  <TabsTrigger value="past">Past Appointments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any upcoming appointments</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to="/patient/book-appointment">Book an Appointment</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden transition-all hover:shadow-lg">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className={`md:w-2 h-full ${
                                appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <div className="p-4 flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">Appointment with Dr. {appointment.doctorName}</h3>
                                    <p className="text-blue-600 font-medium">Specialization: {appointment.specialization}</p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      appointment.status === 'confirmed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-sm font-medium text-gray-500">Date & Time</div>
                                    <div>
                                      <div>{new Date(appointment.date).toLocaleDateString()}</div>
                                      <div>{appointment.timeSlot}</div>
                                    </div>
                                  </div>
                                  <div className="md:text-right mt-2 md:mt-0">
                                    <Button 
                                      variant="outline" 
                                      className="mr-2"
                                      onClick={() => handleViewDetails(appointment)}
                                    >
                                      View Details
                                    </Button>
                                    {appointment.status !== 'cancelled' && (
                                      <Button variant="destructive">Cancel</Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any past appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden transition-all hover:shadow-lg">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className={`md:w-2 h-full ${
                                appointment.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                              }`} />
                              <div className="p-4 flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">Appointment with Dr. {appointment.doctorName}</h3>
                                    <p className="text-blue-600 font-medium">Specialization: {appointment.specialization}</p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      appointment.status === 'completed' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-sm font-medium text-gray-500">Date & Time</div>
                                    <div>
                                      <div>{new Date(appointment.date).toLocaleDateString()}</div>
                                      <div>{appointment.timeSlot}</div>
                                    </div>
                                  </div>
                                  <div className="md:text-right mt-2 md:mt-0">
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleViewDetails(appointment)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Appointment Details</DialogTitle>
            <DialogDescription>
              Information about your appointment
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Doctor</p>
                  <p className="font-medium">Dr. {selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Specialization</p>
                  <p className="font-medium">{selectedAppointment.specialization}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="font-medium">{selectedAppointment.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`font-medium ${
                    selectedAppointment.status === 'confirmed' ? 'text-green-600' : 
                    selectedAppointment.status === 'pending' ? 'text-yellow-600' :
                    selectedAppointment.status === 'completed' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Symptoms</p>
                <p className="font-medium">{selectedAppointment.symptoms}</p>
              </div>
              
              {selectedAppointment.diagnosis && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                  <p className="font-medium">{selectedAppointment.diagnosis}</p>
                </div>
              )}
              
              {selectedAppointment.prescription && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Prescription</p>
                  <p className="font-medium">{selectedAppointment.prescription}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
