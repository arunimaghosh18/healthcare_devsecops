
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Appointment } from '@/types';
import { format, startOfWeek, addDays } from 'date-fns';

interface AppointmentChartProps {
  appointments: Appointment[];
}

const AppointmentChart: React.FC<AppointmentChartProps> = ({ appointments }) => {
  // Format data for the chart
  const formatDataForChart = () => {
    // Ensure appointments is an array
    const safeAppointments = appointments || [];
    
    // Get start of current week
    const startOfCurrentWeek = startOfWeek(new Date());
    
    // Create an array for each day of the week
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfCurrentWeek, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayName = format(day, 'EEE');
      
      const count = safeAppointments.filter(app => app.date === dayStr).length;
      
      return {
        name: dayName,
        appointments: count
      };
    });
    
    return daysOfWeek;
  };

  const data = formatDataForChart();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="appointments" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AppointmentChart;
