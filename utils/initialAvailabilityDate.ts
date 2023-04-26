// Returns tomorrow's date in ISO format for initial /availability request
export const initialAvailabilityDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};
