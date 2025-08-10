
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createDoctor, getAllSpecializations } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Phone, BadgeCheck, GraduationCap, UserRound, CalendarDays } from 'lucide-react';

const DoctorRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Add validation for dateOfBirth format before submission
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  const [phoneNumber, setPhoneNumber] = useState('');

  // Real-time phone number input validation to allow only digits, +, -, space
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const filtered = input.replace(/[^0-9+\-\s]/g, '');
    setPhoneNumber(filtered);
  };
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const specializations = [
    'General Medicine',
    'Internal Medicine',
    'Cardiology',
    'Dermatology',
    'ENT Specialist',
    'Gastroenterology',
    'Neurology',
    'Obstetrics & Gynecology',
    'Ophthalmology',
    'Orthopedic',
    'Pediatrics',
    'Physical Medicine',
    'Psychiatry',
    'Psychology',
    'Pulmonology',
    'Rheumatology',
    'Endocrinology',
    'Infectious Disease',
    'Allergist',
    'General Surgery',
    'Audiologist'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidDate(dateOfBirth)) {
      toast({
        title: 'Invalid Date of Birth',
        description: 'Please enter a valid date of birth.',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number length (10 digits)
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Phone number must be exactly 10 digits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = createDoctor(
        "doctor", 
        email, 
        password, 
        firstName, 
        lastName,
        dateOfBirth,
        phoneNumber,
        licenseNumber,
        specialization
      );

      if (user) {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created',
        });
        // Dispatch event to notify admin dashboard
        window.dispatchEvent(new Event('userRegistered'));
        navigate('/doctor/login');
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg border-t-4 border-t-green-600">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Stethoscope className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">Doctor Registration</CardTitle>
            <CardDescription>
              Create your doctor account to start providing healthcare services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <UserRound className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="123-456-7890"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <div className="relative">
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="MD12345"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <div className="relative">
                  <Select value={specialization} onValueChange={setSpecialization}>
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/doctor/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              Are you a patient?{' '}
              <Link to="/patient/register" className="text-green-600 hover:underline">
                Register as Patient
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              <Link to="/" className="text-green-600 hover:underline">
                Return to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DoctorRegister;
