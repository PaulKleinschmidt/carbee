// Returns date 24 hours from now in ISO format for initial /availability request
// TODO: this can be slightly inaccurate due to daylight savings time
export const initialAvailabilityDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};
