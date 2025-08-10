
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doctor } from '@/types';
import { UserRound, Mail, Phone, Calendar, GraduationCap, BadgeCheck, FileText } from 'lucide-react';

interface DoctorProfileCardProps {
  doctor: Doctor;
}

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({ doctor }) => {
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
      <CardHeader className="border-b pb-4 bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <UserRound className="h-6 w-6 text-blue-600" />
          Doctor Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-blue-500" />
              Full Name
            </p>
            <p className="font-medium text-lg">Dr. {doctor.firstName} {doctor.lastName}</p>
          </div>
          
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Email
            </p>
            <p className="font-medium">{doctor.email}</p>
          </div>
          
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              Specialization
            </p>
            <p className="font-medium">{doctor.specialization || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-blue-500" />
              License Number
            </p>
            <p className="font-medium">{doctor.licenseNumber || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              Phone Number
            </p>
            <p className="font-medium">{doctor.phoneNumber || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Date of Birth
            </p>
            <p className="font-medium">{formatDate(doctor.dateOfBirth)}</p>
          </div>

          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Appointments
            </p>
            <p className="font-medium">{doctor.appointments?.length || 0} appointments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileCard;
