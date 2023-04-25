import { getToken } from 'next-auth/jwt';
import { GetServerSidePropsContext } from 'next/types';

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

  if (token?.access_token) {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token?.access_token,
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

    return { props: { appointments, availability } };
  } else {
    // Redirect users to sign in page if they are not signed in
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }
}
