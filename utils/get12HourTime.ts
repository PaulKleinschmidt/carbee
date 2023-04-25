export const get12HourTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
