import { TAppointment } from '@/schemas/appointments';
import { redirect } from 'next/dist/server/api-utils';

export const getAppointments = async (
  page: number,
  pageSize: number
): Promise<TAppointment[]> => {
  return fetch(`/api/appointments?page=${page}&size=${pageSize}`).then(
    (res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }
  );
};
