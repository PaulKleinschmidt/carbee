import { Appointments } from '@/schemas/appointments';
import { Availability } from '@/schemas/availability';
import { getToken } from 'next-auth/jwt';
import { GetServerSidePropsContext } from 'next/types';
import { z } from 'zod';

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-font-color-primary bg-background-color-body">
      Dashboard
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
      props: {},
    };
  }
}
