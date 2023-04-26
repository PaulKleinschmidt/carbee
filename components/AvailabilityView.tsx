import { initialAvailabilityDate } from '@/utils/initialAvailabilityDate';

type Props = {
  times: string[];
  selectedDate: string;
  onDateChange(date: string): void;
  loading: boolean;
};

export const AvailabilityView = ({
  times,
  selectedDate,
  onDateChange,
  loading,
}: Props) => {
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="date" className="mr-2">
          Select a Date:
        </label>

        <input
          type="date"
          id="date"
          className="border-2 border-brand-secondary-400 rounded-sm mb-4"
          value={selectedDate}
          onChange={(e) => {
            onDateChange(e.target.value);
          }}
          min={initialAvailabilityDate()}
        ></input>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="mb-4 max-h-64 overflow-y-scroll list-disc list-inside">
          {times.map((time) => (
            <li key={time}>{time}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
