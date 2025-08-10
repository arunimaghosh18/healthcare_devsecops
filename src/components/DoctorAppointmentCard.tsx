
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { updateAppointmentStatus } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import { isTimeSlotPast } from '@/utils/dateUtils';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdate: () => void;
}

const DoctorAppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onUpdate }) => {
  const { toast } = useToast();
  const isPast = isTimeSlotPast(appointment.date, appointment.timeSlot);
  
  const handleComplete = async () => {
    try {
      await updateAppointmentStatus(appointment.id, 'completed');
      toast({
        title: 'Success',
        description: 'Appointment marked as completed',
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment status',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment with {appointment.patientName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{appointment.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{appointment.timeSlot}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Symptoms</p>
            <p className="font-medium">{appointment.symptoms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{appointment.status}</p>
          </div>
        </div>
        
        {appointment.status === 'confirmed' && (
          <Button
            onClick={handleComplete}
            disabled={!isPast}
            className="w-full mt-4"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentCard;
