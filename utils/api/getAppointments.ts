import { TAppointment } from '@/schemas/appointments';

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
