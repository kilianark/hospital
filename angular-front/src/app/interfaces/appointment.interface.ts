export interface AppointmentInterface {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: Date;
  reason: string;
  status: string;
}
