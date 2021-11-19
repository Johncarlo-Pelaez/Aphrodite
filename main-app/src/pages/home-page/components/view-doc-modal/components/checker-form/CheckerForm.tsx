import { ReactElement, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Document } from 'models';
import { useCheckerDocument } from 'hooks';
import { FileInfo, ReadOnlyIndexFields } from '../indexes-form';
import { DocumentDateField, RemarksField } from './components';

export interface ICheckerFormValues {
  documentDate: string;
  remarks: string;
}

export interface CheckerFormProps {
  document?: Document;
  triggerCloseModal: () => void;
}

export const CheckerForm = forwardRef(
  (props: CheckerFormProps, ref): ReactElement => {
    const { document, triggerCloseModal } = props;

    const {
      isLoading: isCheckDocSaving,
      isError: hasCheckDocError,
      mutateAsync: checkDocumentAsync,
      reset: resetCheckDocument,
    } = useCheckerDocument();

    const { control, reset, handleSubmit, setError } =
      useForm<ICheckerFormValues>();

    const closeModal = (): void => {
      reset({
        documentDate: '',
        remarks: '',
      });
      resetCheckDocument();
      triggerCloseModal();
    };

    const approveDocumentSubmit = async (
      data: ICheckerFormValues,
      approve: boolean = true,
    ): Promise<void> => {
      const { documentDate, remarks } = data;

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

      if (!document) {
        alert('Please select a document.');
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

        closeModal();
      }
    };

    const approveDocument = () => {
      handleSubmit((data) => approveDocumentSubmit(data))().catch((error) => {
        alert(error);
      });
    };

    const disapproveDocument = () => {
      handleSubmit((data) => approveDocumentSubmit(data, false))().catch(
        (error) => {
          alert(error);
        },
      );
    };

    useImperativeHandle(ref, () => ({
      approveDocument,
      disapproveDocument,
    }));

    return (
      <>
        <Alert variant="danger" show={hasCheckDocError}>
          Failed to check.
        </Alert>
        <Card>
          <Card.Header className="text-center">INDEXES</Card.Header>
          <Card.Body>
            <FileInfo document={document} />
            <hr />
            <Form>
              <fieldset disabled={isCheckDocSaving}>
                <ReadOnlyIndexFields document={document} />
                <DocumentDateField control={control} />
                <RemarksField control={control} />
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  },
);

export default CheckerForm;
