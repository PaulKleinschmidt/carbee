import { TAppointment } from '@/schemas/appointments';
import { TAvailability } from '@/schemas/availability';

export const getAvailability = async (date: string): Promise<TAvailability> => {
  return fetch(`/api/availability?date=${date}`).then((res) => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(res);
  });
};
