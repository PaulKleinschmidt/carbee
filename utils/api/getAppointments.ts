import { Appointments } from '@/schemas/appointments';

export async function getAppointments(
  page: string,
  size: string,
  accessToken?: string
) {
  const options = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  };
  const [appointmentRes, appointmentsNextPageRes] = await Promise.all([
    fetch(
      `${process.env.API_BASE_URL}/api/v1/appointments?page=${page}&size=${size}`,
      options
    ),
    // This is a bit of a hack but is necessary to determine whether to enable the "next page" button. Ideally the backend would return this value.
    fetch(
      `${process.env.API_BASE_URL}/api/v1/appointments?page=${
        parseInt(page) + 1
      }&size=${size}`,
      options
    ),
  ]);

  if (appointmentRes.ok && appointmentsNextPageRes.ok) {
    const [appointments, appointmentsNextPage] = await Promise.all([
      appointmentRes.json(),
      appointmentsNextPageRes.json(),
    ]);

    const hasNextPage: boolean =
      !!appointmentsNextPage && appointmentsNextPage.length > 0;

    // safeParse returns either an object containing the successfully parsed data or an
    // error object with details about the validation errors.
    const parsed = Appointments.safeParse(appointments);

    if (parsed.success) {
      return {
        status: appointmentRes.status,
        appointments: parsed.data,
        hasNextPage,
      };
    } else {
      // Log the validation errors. Ideally this would be logged to an external error client like Sentry.
      console.error(parsed.error);

      return { status: 400 };
    }
  } else {
    return { status: appointmentRes.status };
  }
}
