// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Appointments, TAppointment } from '@/schemas/appointments';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = TAppointment[];

type ExtendedNextApiRequest = NextApiRequest & {
  query: { size: string; page: string };
};

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
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

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/appointments?page=${req.query.page}&size=${req.query.size}`,
      options
    );

    const appointments = await response.json();

    // safeParse returns either an object containing the successfully parsed data or an
    // error object with details about the validation errors.
    const parsed = Appointments.safeParse(appointments);

    if (parsed.success) {
      return res.status(200).json(parsed.data);
    } else {
      // Log the validation errors. Ideally this would be logged to an external error client like Sentry.
      console.error(parsed.error);

      return res.status(500);
    }
  } else {
    return res.status(401);
  }
}
