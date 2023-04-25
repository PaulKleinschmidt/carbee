import { Appointment } from '@/components/Appointment';
import { Appointments } from '@/schemas/appointments';
import { Availability } from '@/schemas/availability';
import { getToken } from 'next-auth/jwt';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { z } from 'zod';

export default function Dashboard({
  appointments,
  availability,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col text-font-color-primary p-8 bg-background-color-body mx-auto max-w-full md:max-w-6xl md:p-24">
      <h1 className="text-3xl mb-4">Dashboard</h1>

      <h2 className="text-2xl mb-2">Appointments</h2>
      {appointments.map((appointment) => {
        return <Appointment appointment={appointment} />;
      })}
    </main>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  if (token?.accessToken) {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token?.accessToken,
        'Content-Type': 'application/json',
      },
    };

    // Get tomorrow's date in ISO format to pass to the /availability request
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrowISOString = date.toISOString().split('T')[0];

    const [appointmentsRes, availabilityRes] = await Promise.all([
      fetch(`${process.env.API_BASE_URL}/api/v1/appointments`, options),
      fetch(
        `${process.env.API_BASE_URL}/api/v1/availability/${tomorrowISOString}`,
        options
      ),
    ]);

    const [appointments, availability] = await Promise.all([
      appointmentsRes.json(),
      availabilityRes.json(),
    ]);

    // safeParse returns either an object containing the successfully parsed data or an
    // error object with details about the validation errors.
    const parsed = z
      .object({ availability: Availability, appointments: Appointments })
      .safeParse({ availability, appointments });

    if (parsed.success) {
      return {
        props: {
          appointments: parsed.data.appointments,
          availability: parsed.data.availability,
        },
      };
    } else {
      // Log the validation errors. Ideally this would be logged to an external error client like Sentry.
      console.error(parsed.error);

      return {
        redirect: {
          destination: '/500',
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
}
