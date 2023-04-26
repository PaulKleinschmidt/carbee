import { TAppointment } from '@/schemas/appointments';
import { dateStringTo12HourTime } from '@/utils/dateStringTo12HourTime';
import { formatDateString } from '@/utils/formatDateString';
import { useEffect, useState } from 'react';

type Props = {
  appointment: TAppointment;
};

export const Appointment = ({ appointment }: Props) => {
  const [formattedScheduledTime, setFormattedScheduledTime] = useState('');
  const [formattedStartTime, setFormattedStartTime] = useState('');
  const [formattedCompletedTime, setFormattedCompletedTime] = useState('');

  // Dates need to be formatted inside useEffect to prevent React hydration errors
  // https://stackoverflow.com/a/73006128/9281222
  useEffect(() => {
    setFormattedScheduledTime(formatDateString(appointment.scheduledTime));

    if (appointment.workOrderDto.startTime) {
      setFormattedStartTime(
        dateStringTo12HourTime(appointment.workOrderDto.startTime)
      );
    }

    if (appointment.completeTime) {
      setFormattedCompletedTime(
        dateStringTo12HourTime(appointment.completeTime)
      );
    }
  }, []);

  return (
    <div className="p-10 w-full border-2 border-font-color-primary mb-4 text-sm rounded-sm shadow-sm flex space-x-10">
      <div>
        <div className="mb-4">
          <div className="font-bold">Scheduled</div>
          {formattedScheduledTime}
        </div>

        <div>
          <div className="font-bold">Started / Completed</div>
          {formattedStartTime ? (
            <div className="mb-4">
              {formattedStartTime} -{' '}
              {formattedCompletedTime ? formattedCompletedTime : 'Incomplete'}{' '}
            </div>
          ) : (
            <div className="mb-4">TBD</div>
          )}
        </div>
      </div>

      <div>
        <div className="font-bold">Service</div>
        <div className="mb-4">{appointment.workOrderDto.service}</div>

        <div className="font-bold">Status</div>
        <div>{appointment.workOrderDto.status}</div>
      </div>
    </div>
  );
};
