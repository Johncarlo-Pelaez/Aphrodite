import { ReactElement, Dispatch, SetStateAction } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { DateSelect } from 'core/ui';

export interface DateRangeProps {
  setDateFrom: Dispatch<SetStateAction<Date | undefined>>;
  setDateTo: Dispatch<SetStateAction<Date | undefined>>;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export const DateRange = ({
  setDateFrom,
  setDateTo,
  dateFrom,
  dateTo,
}: DateRangeProps): ReactElement => {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap my-1">
      <Form>
        <Stack direction="horizontal" gap={2}>
          <DateSelect
            value={dateFrom}
            onChange={setDateFrom}
            label="Date Logged Start"
            floatLabel
          />
          <DateSelect
            value={dateTo}
            onChange={setDateTo}
            label="Date Logged End"
            floatLabel
          />
        </Stack>
      </Form>
    </div>
  );
};

export default DateRange;
