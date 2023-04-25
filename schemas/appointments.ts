import App from 'next/app';
import { z } from 'zod';

const WorkOrderDto = z.object({
  service: z.string(),
  status: z.enum(['READY', 'PAID', 'COMPLETE', 'IN_PROGRESS']),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  completeTime: z.string().optional(),
  paymentTime: z.string().optional(),
  cancelTime: z.string().optional(),
});

const Appointment = z.object({
  id: z.string(),
  userId: z.string(),
  duration: z.number(),
  scheduledTime: z.string(),
  workOrderDto: WorkOrderDto,
  status: z.enum(['SCHEDULED', 'PAID', 'COMPLETE', 'IN_PROGRESS']),
  completeTime: z.string().optional(),
  paymentId: z.string().optional(),
  cancelTime: z.string().optional(),
});

export const Appointments = z.array(Appointment);

export type TAppointment = z.infer<typeof Appointment>;
