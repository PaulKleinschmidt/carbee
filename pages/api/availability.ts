import { TAvailability } from '@/schemas/availability';
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

  const result = await getAvailability(req.query.date, token?.accessToken);

  if (result.availability && result.status === 200) {
    return res.status(200).json(result.availability);
  } else {
    return res.status(result.status).json({ error: 'Failed to fetch data' });
  }
}
