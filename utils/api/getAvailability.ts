import { Availability } from '@/schemas/availability';

export async function getAvailability(date: string, accessToken?: string) {
  const options = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v1/availability/${date}`,
    options
  );

  if (response.ok) {
    const availability = await response.json();

    // safeParse returns either an object containing the successfully parsed data or an
    // error object with details about the validation errors.
    const parsed = Availability.safeParse(availability);

    if (parsed.success) {
      return { status: 200, availability: parsed.data };
    } else {
      // Log the validation errors. Ideally this would be logged to an external error client like Sentry.
      console.error(parsed.error);

      return { status: 400 };
    }
  } else {
    return { status: response.status };
  }
}
