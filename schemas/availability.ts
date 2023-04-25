import { z } from 'zod';

export const Availability = z.object({ times: z.array(z.string()) });
