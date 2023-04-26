// Format date to Month DD, YYYY
export const formatDateString = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    timeZone: 'UTC',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};
