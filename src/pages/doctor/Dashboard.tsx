import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  getAppointmentsByDoctorId, 
  updateAppointmentStatus, 
  isDoctorAvailable
} from '@/lib/data';
import { Doctor, Appointment } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Stethoscope,
  CalendarDays,
  CalendarX,
  LogOut,
  UserCircle
} from 'lucide-react';
import AppointmentChart from '@/components/AppointmentChart';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }

    setDoctor(user as Doctor);
    
    const doctorAppointments = getAppointmentsByDoctorId(user.id);
    setAppointments(doctorAppointments);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('healEasy_auth');
    navigate('/');
  };

  const isAppointmentCompletable = (appointment: Appointment) => {
    if (appointment.status !== 'confirmed') return false;
    
    const appointmentDate = new Date(appointment.date);
    const appointmentTime = appointment.timeSlot.split(':').map(Number);
    appointmentDate.setHours(appointmentTime[0], appointmentTime[1], 0);
    
    const now = new Date();
    const oneHourAfter = new Date(appointmentDate);
    oneHourAfter.setHours(oneHourAfter.getHours() + 1);
    
    return now >= appointmentDate && now <= oneHourAfter;
  };

  const handleMarkAsCompleted = (appointmentId: string) => {
    try {
      const updatedAppointment = updateAppointmentStatus(appointmentId, 'completed');
      if (updatedAppointment) {
        setAppointments(appointments.map(app => 
          app.id === appointmentId ? updatedAppointment : app
        ));
        toast({
          title: 'Appointment completed',
          description: 'The appointment has been marked as completed.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment status.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getTodaysAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().slice(0, 10);
    
    return appointments.filter(app => 
      app.date === todayString && 
      (app.status === 'confirmed' || app.status === 'pending')
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return (appDate > today && (app.status === 'confirmed' || app.status === 'pending'));
    });
  };

  const getCompletedAppointments = () => {
    return appointments.filter(app => app.status === 'completed');
  };

  const getCancelledAppointments = () => {
    return appointments.filter(app => app.status === 'cancelled');
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="h-full shadow-lg border-l-4 border-l-green-600">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                      {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">Dr. {doctor.firstName} {doctor.lastName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    {doctor.specialization}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 rounded-full p-2">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                    </span>
                    <div>
                      <p className="font-semibold text-green-800">{getTodaysAppointments().length}</p>
                      <p className="text-xs text-gray-500">Today's Appointments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 rounded-full p-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </span>
                    <div>
                      <p className="font-semibold text-green-800">{getUpcomingAppointments().length}</p>
                      <p className="text-xs text-gray-500">Upcoming Appointments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 rounded-full p-2">
                      <CheckCircle2 className="h-4 w-4 text-gray-600" />
                    </span>
                    <div>
                      <p className="font-semibold text-green-800">{getCompletedAppointments().length}</p>
                      <p className="text-xs text-gray-500">Completed Appointments</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t my-2"></div>
                
                <Link to="/doctor/profile" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                
                <Link to="/doctor/unavailability" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarX className="h-4 w-4 mr-2" />
                    Manage Availability
                  </Button>
                </Link>
                
                <Button variant="outline" className="justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 space-y-6"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-green-600" />
                  Your Dashboard
                </CardTitle>
                <CardDescription>
                  Manage your appointments and schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="today">
                    {getTodaysAppointments().length > 0 ? (
                      <div className="space-y-4">
                        {getTodaysAppointments().map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback className="bg-blue-100 text-blue-800">
                                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{appointment.patientName}</h3>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {appointment.timeSlot}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 flex gap-2">
                                    {appointment.status === 'pending' && (
                                      <Badge className="bg-yellow-500">Pending</Badge>
                                    )}
                                    {appointment.status === 'confirmed' && (
                                      <Badge className="bg-green-500">Confirmed</Badge>
                                    )}
                                    
                                    {isAppointmentCompletable(appointment) && (
                                      <Badge className="bg-green-100 text-green-800 border border-green-300">
                                        Completable
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 md:mt-0">
                                  {isAppointmentCompletable(appointment) && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleMarkAsCompleted(appointment.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Mark Completed
                                    </Button>
                                  )}
                                  
                                  <Link to={`/doctor/appointment/${appointment.id}`}>
                                    <Button size="sm" variant="outline">
                                      View Details
                                      <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No appointments for today</h3>
                        <p className="text-gray-500 mt-1">You're free for the day!</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="upcoming">
                    {getUpcomingAppointments().length > 0 ? (
                      <div className="space-y-4">
                        {getUpcomingAppointments().map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback className="bg-blue-100 text-blue-800">
                                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{appointment.patientName}</h3>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(appointment.date)}
                                        <Clock className="h-3 w-3 ml-2 mr-1" />
                                        {appointment.timeSlot}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 flex gap-2">
                                    {appointment.status === 'pending' && (
                                      <Badge className="bg-yellow-500">Pending</Badge>
                                    )}
                                    {appointment.status === 'confirmed' && (
                                      <Badge className="bg-green-500">Confirmed</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center mt-4 md:mt-0">
                                  <Link to={`/doctor/appointment/${appointment.id}`}>
                                    <Button size="sm" variant="outline">
                                      View Details
                                      <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No upcoming appointments</h3>
                        <p className="text-gray-500 mt-1">You don't have any appointments scheduled.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    {getCompletedAppointments().length > 0 ? (
                      <div className="space-y-4">
                        {getCompletedAppointments().map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback className="bg-green-100 text-green-800">
                                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{appointment.patientName}</h3>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(appointment.date)}
                                        <Clock className="h-3 w-3 ml-2 mr-1" />
                                        {appointment.timeSlot}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Badge className="bg-green-500">Completed</Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center mt-4 md:mt-0">
                                  <Link to={`/doctor/appointment/${appointment.id}`}>
                                    <Button size="sm" variant="outline">
                                      View Details
                                      <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No completed appointments</h3>
                        <p className="text-gray-500 mt-1">You haven't completed any appointments yet.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="cancelled">
                    {getCancelledAppointments().length > 0 ? (
                      <div className="space-y-4">
                        {getCancelledAppointments().map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback className="bg-red-100 text-red-800">
                                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{appointment.patientName}</h3>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(appointment.date)}
                                        <Clock className="h-3 w-3 ml-2 mr-1" />
                                        {appointment.timeSlot}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Badge className="bg-red-500">Cancelled</Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center mt-4 md:mt-0">
                                  <Link to={`/doctor/appointment/${appointment.id}`}>
                                    <Button size="sm" variant="outline">
                                      View Details
                                      <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No cancelled appointments</h3>
                        <p className="text-gray-500 mt-1">You don't have any cancelled appointments.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Appointment Statistics
                </CardTitle>
                <CardDescription>
                  Overview of your appointment statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AppointmentChart 
                  appointments={appointments} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
