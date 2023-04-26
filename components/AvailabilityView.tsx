import { initialAvailabilityDate } from '@/utils/initialAvailabilityDate';

type Props = {
  times: string[];
  selectedDate: string;
  onDateChange(date: string): void;
};

export const AvailabilityView = ({
  times,
  selectedDate,
  onDateChange,
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
          value={selectedDate}
          onChange={(e) => {
            onDateChange(e.target.value);
          }}
          min={initialAvailabilityDate()}
        ></input>
      </div>
      <div className="mb-4 max-h-64 overflow-y-scroll ">
        {times.map((time) => (
          <div key={time}>{time}</div>
        ))}
      </div>
    </div>
  );
};
