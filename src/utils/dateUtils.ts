
export const isTimeSlotPast = (date: string, timeSlot: string): boolean => {
  const [time, period] = timeSlot.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  
  // Convert to 24-hour format
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const appointmentDate = new Date(date);
  appointmentDate.setHours(hour, parseInt(minutes) || 0);
  
  return new Date() > appointmentDate;
};
