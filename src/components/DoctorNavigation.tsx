
import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { CalendarDays, Menu, User, Clock, LogOut, Home } from 'lucide-react';

const DoctorNavigation = () => {
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    // Redirect to login page
    window.location.href = '/doctor/login';
  };

  return (
    <div className="bg-white shadow-md py-4 mb-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-green-600">SRM GLOBAL HOSPITAL</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              <NavigationMenuItem>
                <Link to="/doctor/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/doctor/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/doctor/unavailability" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Unavailability
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation with Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/doctor/dashboard" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link to="/doctor/profile" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                <Link to="/doctor/unavailability" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
                  <Clock className="w-5 h-5 mr-2" />
                  Set Unavailability
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center justify-start px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default DoctorNavigation;
