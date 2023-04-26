// Get 12 hour time from date string
export const dateStringTo12HourTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
