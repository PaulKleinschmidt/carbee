import { TAppointment } from '@/schemas/appointments';
import { getAppointments } from '@/utils/api/getAppointments';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = { appointments: TAppointment[]; hasNextPage: boolean };

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

  const result = await getAppointments(
    req.query.page,
    req.query.size,
    token?.accessToken
  );

  if (result.status === 200 && result.appointments) {
    return res.status(200).json({
      appointments: result.appointments,
      hasNextPage: result.hasNextPage,
    });
  } else {
    return res.status(result.status).json({ error: 'Failed to fetch data' });
  }
}
