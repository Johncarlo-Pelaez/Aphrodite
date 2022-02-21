import {
  ReactElement,
  Fragment,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Document } from 'models';
import { useCheckerDocument } from 'hooks';
import { FileInfo, ReadOnlyIndexFields } from '../indexes-form';
import { DocumentDateField, RemarksField } from './components';
import styles from './CheckerForm.module.css';
import { checkIfForbidden } from 'utils';

export interface ICheckerFormValues {
  documentDate: string;
  remarks: string;
}

export interface CheckerFormProps {
  document?: Document;
  onSubmitted: () => void;
}

export const CheckerForm = forwardRef(
  (props: CheckerFormProps, ref): ReactElement => {
    const { document, onSubmitted: triggerSubmitted } = props;

    const {
      isLoading: isCheckDocSaving,
      isError: hasCheckDocError,
      error,
      mutateAsync: checkDocumentAsync,
      reset: resetCheckDocument,
    } = useCheckerDocument();

    const { control, reset, handleSubmit, setError, setFocus } =
      useForm<ICheckerFormValues>({
        defaultValues: {
          documentDate: document?.documentDate ?? '',
          remarks: document?.remarks ?? '',
        },
      });

    const approveDocumentSubmit = async (
      data: ICheckerFormValues,
      approve: boolean = true,
    ): Promise<void> => {
      const { documentDate, remarks } = data;

      if (!document) {
        alert('Please select a document.');
        return;
      }

      if (!documentDate || documentDate === '') {
        setError('documentDate', {
          type: 'required',
          message: 'Document Date is required',
        });
        return;
      }

      if (!approve && (!remarks || remarks === '')) {
        setError('remarks', {
          type: 'required',
          message: 'Remarks is required',
        });
        return;
      }

      if (!isCheckDocSaving) {
        if (approve) {
          await checkDocumentAsync({
            documentId: document?.id as number,
            documentDate,
            remarks,
          });
          alert('Approve Saved.');
        } else {
          await checkDocumentAsync({
            documentId: document?.id as number,
            documentDate,
            remarks,
            approve: false,
          });
          alert('Disapprove Saved.');
        }

        triggerSubmitted();
      }
    };

    const approveDocument = () => {
      handleSubmit((data) => approveDocumentSubmit(data))().catch(() => {
        alert('Failed to approve.');
      });
    };

    const disapproveDocument = () => {
      handleSubmit((data) => approveDocumentSubmit(data, false))().catch(() => {
        alert('Failed to disapprove.');
      });
    };

    useImperativeHandle(ref, () => ({
      approveDocument,
      disapproveDocument,
    }));

    useEffect(() => {
      return function componentCleanUp() {
        reset({
          documentDate: '',
          remarks: '',
        });
        resetCheckDocument();
      };
      // eslint-disable-next-line
    }, []);

    useEffect(() => setFocus('documentDate'), [document, setFocus]);

    return (
      <Fragment>
        <Alert variant="danger" show={hasCheckDocError}>
          {!!error && checkIfForbidden(error)
            ? 'Permission denied or access not allowed, You may have no permission to check documents.'
            : 'Failed to check.'}
        </Alert>
        <Card>
          <Card.Header className="text-center">INDEXES</Card.Header>
          <Card.Body>
            <FileInfo document={document} />
            <hr />
            <Form className={styles.form}>
              <fieldset disabled={isCheckDocSaving}>
                <ReadOnlyIndexFields
                  document={document}
                  hideDocumentDate
                  hideRemarks
                />
                <DocumentDateField control={control} />
                <RemarksField control={control} />
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      </Fragment>
    );
  },
);

export default CheckerForm;
