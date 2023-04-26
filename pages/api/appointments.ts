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

  if (token?.accessToken) {
    const result = await getAppointments(
      req.query.page,
      req.query.size,
      token.accessToken
    );

    if (result) {
      return res.status(200).json({
        appointments: result.appointments,
        hasNextPage: result.hasNextPage,
      });
    } else {
      return res.status(400).json({ error: 'Failed to fetch data' });
    }
  } else {
    return res.status(401).json({ error: 'error' });
  }
}
