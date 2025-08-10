
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types';
import { UserRound, Mail, Phone, Calendar, Droplets, MapPin } from 'lucide-react';

interface PatientProfileCardProps {
  patient: Patient;
}

const PatientProfileCard: React.FC<PatientProfileCardProps> = ({ patient }) => {
  // Format date properly with fallback
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Not available';
      
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return 'Not available';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not available';
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <UserRound className="h-6 w-6 text-blue-600" />
          Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-blue-500" />
              Full Name
            </p>
            <p className="font-medium text-lg">{patient.firstName} {patient.lastName}</p>
          </div>
          
          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Email
            </p>
            <p className="font-medium">{patient.email}</p>
          </div>

          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Blood Group
            </p>
            <p className="font-medium">{patient.bloodGroup || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              Phone Number
            </p>
            <p className="font-medium">{patient.phoneNumber || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Date of Birth
            </p>
            <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
          </div>

          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Appointments
            </p>
            <p className="font-medium">{patient.appointments?.length || 0} appointments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientProfileCard;
