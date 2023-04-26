import { Appointment } from '@/components/Appointment';
import { AvailabilityView } from '@/components/AvailabilityView';
import { Appointments, TAppointment } from '@/schemas/appointments';
import { Availability, TAvailability } from '@/schemas/availability';
import { getAppointments } from '@/utils/api/getAppointments';
import { getAvailability } from '@/utils/api/getAvailability';
import { initialAvailabilityDate } from '@/utils/initialAvailabilityDate';
import { getToken } from 'next-auth/jwt';
import { getCsrfToken, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useState } from 'react';
import { z } from 'zod';

const PAGE_SIZE = 3;

export default function Dashboard({
  initialAppointments,
  initialAvailability,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [appointments, setAppointments] =
    useState<TAppointment[]>(initialAppointments);
  const [availability, setAvailability] =
    useState<TAvailability>(initialAvailability);

  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialAvailabilityDate());
  const router = useRouter();

  const onPaginationClick = (page: number) => {
    getAppointments(page, PAGE_SIZE)
      .then((appointments) => {
        if (appointments && appointments.length) {
          setAppointments(appointments);
          setCurrentPage(page);
        }
      })
      .catch((res) => {
        if (res.status === 401) {
          router.push('/login');
        } else {
          setError(true);
        }
      });
  };

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    getAvailability(date)
      .then((availability) => {
        console.log('availability', availability);
        setAvailability(availability);
      })
      .catch((res) => {
        if (res.status === 401) {
          router.push('/login');
        } else {
          setError(true);
        }
      });
  };

  return (
    <main className="flex min-h-screen flex-col text-font-color-primary p-8 bg-background-color-body mx-auto max-w-full md:max-w-6xl md:p-24">
      <h1 className="text-3xl mb-4">Dashboard</h1>

      <h2 className="text-2xl mb-2">Appointments</h2>
      {appointments.map((appointment) => {
        return <Appointment key={appointment.id} appointment={appointment} />;
      })}
      <div className="text-center">
        <button
          onClick={() => {
            onPaginationClick(currentPage - 1);
          }}
          disabled={currentPage === 0}
          className="mx-1 border-2 border-font-color-light-grey rounded-lg px-1 shadow-lg"
        >
          Prev
        </button>
        Page: {currentPage + 1}
        <button
          className="mx-1 border-2 border-font-color-light-grey rounded-lg px-1"
          onClick={() => {
            onPaginationClick(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
      <h2 className="text-2xl mb-2">Availability</h2>
      <AvailabilityView
        onDateChange={onDateChange}
        selectedDate={selectedDate}
        times={availability.times}
      />
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

    const [appointmentsRes, availabilityRes] = await Promise.all([
      fetch(
        `${process.env.API_BASE_URL}/api/v1/appointments?page=0&size=${PAGE_SIZE}`,
        options
      ),
      fetch(
        `${
          process.env.API_BASE_URL
        }/api/v1/availability/${initialAvailabilityDate()}`,
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
          initialAppointments: parsed.data.appointments,
          initialAvailability: parsed.data.availability,
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
