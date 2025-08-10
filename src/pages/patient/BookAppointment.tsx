
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAvailableDoctors, 
  getAvailableTimeSlots, 
  createAppointment, 
  getCurrentUser, 
  getAllSpecializations 
} from '@/lib/data';
import { Patient, Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowRight, Stethoscope, CalendarDays, Clock, UserRound, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { predictHealth } from '@/utils/healthPredictor';

// Update the BookingStep enum to remove the PredictProblem step
enum BookingStep {
  Symptoms = 1,
  ChooseDate = 2,
  ChooseDoctor = 3,
  ChooseTime = 4,
  Confirmation = 5
}

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.Symptoms);
  const [symptoms, setSymptoms] = useState('');
  const [potentialProblems, setPotentialProblems] = useState<string[]>([]);
  const [suggestedProblem, setSuggestedProblem] = useState('');
  const [suggestedSpecialization, setSuggestedSpecialization] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'patient') {
      navigate('/patient/login');
      return;
    }
  }, [navigate]);

  // Analyze symptoms and automatically suggest problem and specialization
  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "We need your symptoms to suggest appropriate care",
        variant: "destructive"
      });
      return;
    }

    const predictions = predictHealth(symptoms);
    if (predictions.length > 0) {
      // Get the most likely problem (first in the array)
      const mostLikelyProblem = predictions[0];
      setSuggestedProblem(mostLikelyProblem.problem);
      setSuggestedSpecialization(mostLikelyProblem.specialization);
      
      // Store all potential problems for displaying to the user
      setPotentialProblems(predictions.map(p => p.problem));
    } else {
      setSuggestedProblem('General Check-up');
      setSuggestedSpecialization('General Physician');
      setPotentialProblems(['General Check-up']);
    }
    
    // Move directly to date selection
    setCurrentStep(BookingStep.ChooseDate);
  };

  useEffect(() => {
    if (date && suggestedSpecialization) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const doctors = getAvailableDoctors(formattedDate, suggestedSpecialization);
      setAvailableDoctors(doctors);
      
      // Clear previous doctor selection when date or specialization changes
      setSelectedDoctorId('');
    }
  }, [date, suggestedSpecialization]);

  useEffect(() => {
    if (selectedDoctorId && date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const slots = getAvailableTimeSlots(selectedDoctorId, formattedDate);
      setAvailableTimeSlots(slots);
      
      // Clear previous time slot selection when doctor changes
      setTimeSlot('');
    }
  }, [selectedDoctorId, date]);

  const handleBookAppointment = async () => {
    if (!date || !selectedDoctorId || !timeSlot || !symptoms || !suggestedProblem) {
      toast({
        title: 'Missing fields',
        description: 'Please complete all steps of the booking process.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const patient = getCurrentUser() as Patient;
      const doctor = availableDoctors.find(d => d.id === selectedDoctorId);

      if (!patient || !doctor) {
        toast({
          title: 'Error',
          description: 'Could not retrieve patient or doctor information.',
          variant: 'destructive',
        });
        return;
      }

      const newAppointment = {
        patientId: patient.id,
        doctorId: doctor.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        specialization: suggestedSpecialization,
        date: formattedDate,
        timeSlot: timeSlot,
        status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        symptoms: symptoms,
        predictedProblem: suggestedProblem,
      };

      createAppointment(newAppointment);

      toast({
        title: 'Appointment booked',
        description: 'Your appointment has been booked successfully.',
      });

      navigate('/patient/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === BookingStep.ChooseDate && date) {
      setCurrentStep(BookingStep.ChooseDoctor);
    } else if (currentStep === BookingStep.ChooseDoctor && selectedDoctorId) {
      setCurrentStep(BookingStep.ChooseTime);
    } else if (currentStep === BookingStep.ChooseTime && timeSlot) {
      setCurrentStep(BookingStep.Confirmation);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > BookingStep.Symptoms) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.Symptoms:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-lg font-medium">Describe your symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms in detail (e.g., headache, fever, cough, body pain)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[150px] text-base"
              />
              <p className="text-sm text-gray-500 italic mt-1">
                We'll analyze your symptoms to suggest appropriate care
              </p>
            </div>
            <Button 
              onClick={analyzeSymptoms} 
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
              disabled={!symptoms.trim()}
              size="lg"
            >
              Analyze Symptoms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case BookingStep.ChooseDate:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Based on your symptoms:</h3>
              <p className="font-semibold text-lg">We suggest you see a <span className="text-blue-700">{suggestedSpecialization}</span></p>
              <p className="mt-2">
                <span className="font-medium">Potential condition:</span> {suggestedProblem}
              </p>
              {potentialProblems.length > 1 && (
                <div className="mt-2">
                  <p className="font-medium">Other possible conditions:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {potentialProblems.slice(1, 4).map((problem, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50">
                        {problem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <Label className="text-lg font-medium">Select Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-base h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MMMM d, yyyy') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousStep} variant="outline" size="lg">
                Back
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!date}
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case BookingStep.ChooseDoctor:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-blue-600" />
                <Label htmlFor="doctor" className="text-lg font-medium">Select Doctor</Label>
              </div>
              {availableDoctors.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {availableDoctors.map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        selectedDoctorId === doctor.id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'hover:border-blue-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDoctorId(doctor.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-lg">
                          {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-lg">Dr. {doctor.firstName} {doctor.lastName}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                        {selectedDoctorId === doctor.id && (
                          <div className="ml-auto">
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md bg-gray-50">
                  <p className="text-gray-500">No doctors available on the selected date.</p>
                  <p className="text-sm text-gray-400 mt-1">Please select a different date.</p>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousStep} variant="outline" size="lg">
                Back
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!selectedDoctorId}
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case BookingStep.ChooseTime:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <Label htmlFor="timeSlot" className="text-lg font-medium">Select Time Slot</Label>
              </div>
              {availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="outline"
                      className={`h-12 text-base ${
                        timeSlot === slot 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : ''
                      }`}
                      onClick={() => setTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md bg-gray-50">
                  <p className="text-gray-500">No time slots available with this doctor.</p>
                  <p className="text-sm text-gray-400 mt-1">Please select a different doctor or date.</p>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousStep} variant="outline" size="lg">
                Back
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!timeSlot}
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case BookingStep.Confirmation:
        const selectedDoctor = availableDoctors.find(d => d.id === selectedDoctorId);
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Confirm Your Appointment</h3>
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-lg font-medium">Appointment Summary</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{suggestedSpecialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{date ? format(date, 'MMMM d, yyyy') : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{timeSlot}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <span className="text-gray-600">Symptoms:</span>
                <p className="mt-1 bg-white p-2 rounded border">{symptoms}</p>
              </div>
              
              <div>
                <span className="text-gray-600">Potential condition:</span>
                <p className="mt-1 font-medium text-blue-700">{suggestedProblem}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={handlePreviousStep} variant="outline" size="lg">
                Back
              </Button>
              <Button 
                onClick={handleBookAppointment} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        );
    }
  };

  // Update the stepper UI to match the updated flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-2xl"
      >
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Book an Appointment</CardTitle>
            <CardDescription className="text-blue-100">Schedule your appointment with SRM Global Hospital</CardDescription>
          </CardHeader>
          <CardContent className="mt-6 mb-2">
            {/* Stepper - Updated for 5 steps instead of 6 */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className={`flex flex-col items-center ${index !== 0 ? 'w-full' : ''}`}>
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center ${
                          index + 1 < currentStep
                            ? 'bg-blue-600 text-white'
                            : index + 1 === currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-2 text-center hidden sm:block">
                        {index === 0 ? 'Symptoms' : 
                         index === 1 ? 'Date' : 
                         index === 2 ? 'Doctor' :
                         index === 3 ? 'Time' : 'Confirm'}
                      </span>
                    </div>
                    {index < 4 && (
                      <div
                        className={`flex-grow h-0.5 ${
                          index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {renderStepContent()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookAppointment;
