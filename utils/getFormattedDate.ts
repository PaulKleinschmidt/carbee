export const getFormattedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    timeZone: 'UTC',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};
