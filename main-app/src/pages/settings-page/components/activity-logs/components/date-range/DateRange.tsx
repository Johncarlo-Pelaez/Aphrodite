import { ReactElement, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Form, Stack } from 'react-bootstrap';

export interface DateRangeProps {
  setDateFrom: Dispatch<SetStateAction<Date | null>>;
  setDateTo: Dispatch<SetStateAction<Date | null>>;
}

export const DateRange = ({
  setDateFrom,
  setDateTo,
}: DateRangeProps): ReactElement => {
  const onChangeFrom = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.valueAsDate)
      setDateFrom(new Date(e.target.valueAsDate?.toDateString()));
  };
  const onChangeTo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.valueAsDate)
      setDateTo(new Date(e.target.valueAsDate?.toDateString()));
  };
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap my-1">
      <Form>
        <Stack direction="horizontal" gap={3}>
          <Form.Label htmlFor="inlineFormInputFromDate">From:</Form.Label>
          <Form.Control type="date" name="from" onChange={onChangeFrom} />

          <Form.Label htmlFor="inlineFormInputToDate">To:</Form.Label>
          <Form.Control type="date" name="to" onChange={onChangeTo} />
        </Stack>
      </Form>
    </div>
  );
};

export default DateRange;
