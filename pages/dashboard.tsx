import { Appointment } from '@/components/Appointment';
import { AvailabilityView } from '@/components/AvailabilityView';
import { PaginationControls } from '@/components/PaginationControls';
import { TAppointment } from '@/schemas/appointments';
import { TAvailability } from '@/schemas/availability';
import { apiGet } from '@/utils/api/apiGet';
import { getAppointments } from '@/utils/api/getAppointments';
import { getAvailability } from '@/utils/api/getAvailability';
import { initialAvailabilityDate } from '@/utils/initialAvailabilityDate';
import { errorToast } from '@/utils/toasts';
import { getToken } from 'next-auth/jwt';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = '2';

export default function Dashboard({
  initialAppointments,
  initialAvailability,
  initialHasNextPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [appointments, setAppointments] =
    useState<TAppointment[]>(initialAppointments);
  const [availability, setAvailability] =
    useState<TAvailability>(initialAvailability);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialAvailabilityDate());

  const onPaginationClick = (page: number) => {
    apiGet<{ appointments: TAppointment[]; hasNextPage: boolean }>(
      `/api/appointments?page=${page}&size=${PAGE_SIZE}`
    )
      .then(({ appointments, hasNextPage }) => {
        if (appointments && appointments.length) {
          setAppointments(appointments);
          setCurrentPage(page);
          setHasNextPage(hasNextPage);
        }
      })
      .catch(() => {
        errorToast('Error getting appointments');
      });
  };

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setLoadingAvailability(true);
    apiGet<TAvailability>(`/api/availability?date=${date}`)
      .then((availability) => {
        setAvailability(availability);
      })
      .catch(() => {
        errorToast('Error getting availability');
      })
      .finally(() => {
        setLoadingAvailability(false);
      });
  };

  return (
    <main className="flex min-h-screen flex-col text-font-color-primary p-8 bg-background-color-body mx-auto max-w-full md:max-w-6xl md:p-24">
      <h1 className="text-3xl mb-4">Dashboard</h1>

      <h2 className="text-2xl mb-2">Appointments</h2>
      {appointments.map((appointment) => {
        return <Appointment key={appointment.id} appointment={appointment} />;
      })}
      <PaginationControls
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        onPaginationClick={(page) => onPaginationClick(page)}
      />
      <h2 className="text-2xl mb-2">Availability</h2>
      <AvailabilityView
        loading={loadingAvailability}
        onDateChange={onDateChange}
        selectedDate={selectedDate}
        times={availability.times}
      />
      <ToastContainer />
    </main>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  if (token?.accessToken) {
    const availability = await getAvailability(
      initialAvailabilityDate(),
      token.accessToken
    );

    const appointmentsData = await getAppointments(
      '0',
      PAGE_SIZE,
      token.accessToken
    );

    if (availability && appointmentsData) {
      return {
        props: {
          initialAppointments: appointmentsData.appointments,
          initialHasNextPage: appointmentsData.hasNextPage,
          initialAvailability: availability,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/400',
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
