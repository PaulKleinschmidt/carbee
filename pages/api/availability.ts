// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Appointments, TAppointment } from '@/schemas/appointments';
import { Availability, TAvailability } from '@/schemas/availability';
import { getAvailability } from '@/utils/api/getAvailability';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = TAvailability;

type ExtendedNextApiRequest = NextApiRequest & {
  query: { date: string };
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
    const availability = await getAvailability(
      req.query.date,
      token.accessToken
    );

    if (availability) {
      return res.status(200).json(availability);
    } else {
      return res.status(400).json({ error: 'Failed to fetch data' });
    }
  } else {
    return res.status(401);
  }
}
