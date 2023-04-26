import { z } from 'zod';

export const Availability = z.object({ times: z.array(z.string()) });

export type TAvailability = z.infer<typeof Availability>;
