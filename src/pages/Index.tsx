
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAllSpecializations, getDoctorsBySpecialization } from '@/lib/data';
import { Doctor } from '@/types';
import { 
  ArrowRight, 
  CalendarPlus, 
  Heart, 
  Clock, 
  Stethoscope, 
  Activity, 
  UserRound, 
  Shield,
  Star, 
  Calendar, 
  Clock4,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const specs = getAllSpecializations();
    setSpecializations(specs);
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      const doctorsForSpecialization = getDoctorsBySpecialization(selectedSpecialization);
      setDoctors(doctorsForSpecialization);
      setIsDialogOpen(true);
    }
  }, [selectedSpecialization]);

  const handleSelectDoctor = (doctor: Doctor) => {
    if (selectedSpecialization) {
      localStorage.setItem('selectedDoctorId', doctor.id);
      localStorage.setItem('selectedSpecialization', selectedSpecialization);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedSpecialization(null);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80")',
            filter: 'brightness(0.3)' 
          }}
        ></div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="container mx-auto flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-bold text-white">SRM GLOBAL HOSPITAL</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/patient/login">
                <Button variant="ghost" className="text-white hover:text-blue-100 transition-all">
                  <UserRound className="mr-2 h-4 w-4" />
                  Patient
                </Button>
              </Link>
              <Link to="/doctor/login">
                <Button variant="ghost" className="text-white hover:text-blue-100 transition-all">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Doctor
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="ghost" className="text-white hover:text-blue-100 transition-all">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </div>
          </header>
          
          <div className="container mx-auto flex-1 flex flex-col justify-center px-4 py-20 md:py-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Health, Our Priority
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-10">
                Book appointments with top specialists in just a few clicks. 
                Fast, secure, and convenient healthcare scheduling.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={staggerChildren}
              >
                <motion.div variants={itemVariant}>
                  <Link to="/patient/register">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-105">
                      Register as Patient
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariant}>
                  <Link to="/doctor/register">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-105">
                      Register as Doctor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariant}>
                  <Link to="/patient/login">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white transition-all transform hover:scale-105">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1 text-sm">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SRM GLOBAL HOSPITAL?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies healthcare appointments, making it easier for you to connect with healthcare professionals.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div
              variants={itemVariant}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <CalendarPlus className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book appointments with just a few clicks, 24/7. Choose your preferred doctor and time slot that works for you.
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariant}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Stethoscope className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Top Specialists</h3>
              <p className="text-gray-600">
                Access to a wide network of qualified healthcare professionals across various specializations.
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariant}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Activity className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Your Health</h3>
              <p className="text-gray-600">
                Track your appointments, medical history, and receive reminders for upcoming visits.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Specializations Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 px-4 py-1 text-sm">Specializations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Medical Specializations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click on any specialization to view our expert doctors
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {specializations.map((specialization) => (
              <motion.div 
                key={specialization}
                variants={itemVariant}
                onClick={() => setSelectedSpecialization(specialization)}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                  <CardContent className="p-6">
                    <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{specialization}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Expert care from our specialized doctors
                    </p>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0">
                      View Doctors <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1 text-sm">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SRM GLOBAL HOSPITAL Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast and easy way to book your medical appointments
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div
              variants={itemVariant}
              className="relative"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg relative z-10 border-l-4 border-l-blue-600">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up as a patient or doctor to access all features of the platform.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                <ArrowRight className="h-8 w-8 text-blue-300" />
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariant}
              className="relative"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg relative z-10 border-l-4 border-l-blue-600">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Find a Specialist</h3>
                <p className="text-gray-600">
                  Browse through our list of specialists and choose the one that fits your needs.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                <ArrowRight className="h-8 w-8 text-blue-300" />
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariant}
            >
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-l-blue-600">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Book Appointment</h3>
                <p className="text-gray-600">
                  Select a convenient date and time slot to schedule your appointment.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Care of Your Health?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of patients who have simplified their healthcare journey with SRM GLOBAL HOSPITAL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/patient/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/doctor/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105">
                  Join as Doctor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-bold">SRM GLOBAL HOSPITAL</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SRM GLOBAL HOSPITAL. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Doctor Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Doctors specializing in {selectedSpecialization}</DialogTitle>
            <DialogDescription>
              Select a doctor to book an appointment
            </DialogDescription>
          </DialogHeader>
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow border border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                          {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">Dr. {doctor.firstName} {doctor.lastName}</h3>
                        <p className="text-blue-600 font-medium">{selectedSpecialization}</p>
                        
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </div>
                          <span className="text-sm text-gray-500 ml-1">(100+ reviews)</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Available Today
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Clock4 className="h-3 w-3 mr-1" />
                            10+ Years Exp.
                          </Badge>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Link 
                            to="/patient/login" 
                            onClick={() => handleSelectDoctor(doctor)}
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105">
                              Book Appointment
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No doctors found for this specialization. Please try another specialization.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
