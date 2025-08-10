
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppointmentById, getCurrentUser, updateAppointmentStatus } from '@/lib/data';
import { Appointment, Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, FileText, User, CheckCircle, XCircle } from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }

    if (id) {
      const fetchedAppointment = getAppointmentById(id);
      if (fetchedAppointment && fetchedAppointment.doctorId === user.id) {
        setAppointment(fetchedAppointment);
      } else {
        toast({
          title: 'Not found',
          description: 'Appointment not found or not authorized',
          variant: 'destructive',
        });
        navigate('/doctor/dashboard');
      }
    }
  }, [id, navigate, toast]);

  const handleStatusUpdate = (status: 'confirmed' | 'completed' | 'cancelled') => {
    if (!appointment) return;
    
    setIsLoading(true);
    
    try {
      const updatedAppointment = updateAppointmentStatus(appointment.id, status);
      setAppointment(updatedAppointment);
      
      const statusMessages = {
        confirmed: 'Appointment has been confirmed',
        completed: 'Appointment has been marked as completed',
        cancelled: 'Appointment has been cancelled'
      };
      
      toast({
        title: 'Status updated',
        description: statusMessages[status],
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Format date for display
  const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/doctor/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-t-4 border-t-teal-600">
            <CardHeader>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${
                  appointment.status === 'confirmed' ? 'bg-green-500' :
                  appointment.status === 'completed' ? 'bg-blue-500' :
                  appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <CardTitle className="text-2xl">
                  Appointment Details
                </CardTitle>
              </div>
              <CardDescription>
                View and manage appointment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium flex items-center text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      Patient Information
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <p className="font-semibold text-lg">{appointment.patientName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointment Date
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <p className="font-medium">{appointmentDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Time Slot
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <p className="font-medium">{appointment.timeSlot}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium flex items-center text-gray-500">
                      <FileText className="h-4 w-4 mr-2" />
                      Symptoms
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md min-h-[100px]">
                      <p>{appointment.symptoms || "No symptoms provided"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium flex items-center text-gray-500">
                      Status
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2">
              {appointment.status === 'pending' && (
                <Button
                  variant="default"
                  onClick={() => handleStatusUpdate('confirmed')}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm Appointment
                </Button>
              )}
              
              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                <Button
                  variant="default"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Completed
                </Button>
              )}
              
              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel Appointment
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
