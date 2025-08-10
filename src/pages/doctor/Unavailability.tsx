
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getDoctorById, addDoctorUnavailability, deleteDoctorUnavailability } from '@/lib/data';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import DoctorNavigation from '@/components/DoctorNavigation';
import { Doctor } from '@/types';

const UnavailabilityPage = () => {
  const [doctor, setDoctor] = useState<Doctor | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }

    const fetchDoctor = async () => {
      const doctorData = getDoctorById(user.id);
      setDoctor(doctorData);
    };

    fetchDoctor();
  }, [navigate]);

  const handleAddUnavailability = () => {
    if (!startDate || !endDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    try {
      const updatedDoctor = addDoctorUnavailability(
        doctor!.id, 
        formattedStartDate, 
        formattedEndDate,
        reason
      );

      if (updatedDoctor) {
        setDoctor(updatedDoctor);
        setStartDate(undefined);
        setEndDate(undefined);
        setReason("");
        toast({
          title: "Success",
          description: "Unavailability period added",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add unavailability period",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUnavailability = (startDate: string, endDate: string) => {
    try {
      const updatedDoctor = deleteDoctorUnavailability(
        doctor!.id, 
        startDate,
        endDate
      );

      if (updatedDoctor) {
        setDoctor(updatedDoctor);
        toast({
          title: "Success",
          description: "Unavailability period removed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove unavailability period",
        variant: "destructive",
      });
    }
  };

  if (!doctor) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorNavigation />
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Set Unavailability</CardTitle>
            <CardDescription>
              Inform patients when you are not available for appointments.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Vacation, Sick Leave, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddUnavailability}>Add Unavailability</Button>
          </CardFooter>
        </Card>

        <Card className="max-w-3xl mx-auto mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Current Unavailability Periods</CardTitle>
            <CardDescription>
              Manage your existing unavailability periods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {doctor.unavailableDates && doctor.unavailableDates.length > 0 ? (
              <div className="grid gap-4">
                {doctor.unavailableDates.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="font-semibold">
                      {format(new Date(item.startDate), 'MMMM dd, yyyy')} - {format(new Date(item.endDate), 'MMMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">Reason: {item.reason}</div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUnavailability(item.startDate, item.endDate)}
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">No unavailability periods set.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnavailabilityPage;
