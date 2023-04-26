import { TAppointment } from '@/schemas/appointments';

// Transforms status to a more readable string
export const transformStatus = (
  status: TAppointment['workOrderDto']['status']
): 'Complete' | 'In Progress' | 'Paid' | 'Ready' => {
  switch (status) {
    case 'COMPLETE':
      return 'Complete';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'PAID':
      return 'Paid';
    case 'READY':
      return 'Ready';
  }
};
