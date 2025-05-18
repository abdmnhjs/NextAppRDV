export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Availability = {
  id: number;
  day: WeekDay;
  startHour: number;
  startMinutes: number;
  endHour: number;
  endMinutes: number;
  booked: boolean;
  includePayment: boolean;
  price?: number;
};

export type Appointment = {
  id: number;
  consultantUsername: string;
  clientUsername: string;
  availabilityId: number;
  date: string;
};
