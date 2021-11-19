import {
  ReactElement,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Document } from 'models';
import { useEncodeDocument } from 'hooks';
import {
  NomenclatureField,
  QRBarcodeField,
  ContractNumberField,
  CompanyCodeField,
  DocumentGroupField,
} from './components';
import { LookupOption } from './components/nomen-clature-field';
import { FileInfo } from '../indexes-form';

export interface IEncoderFormValues {
  qrBarCode: string;
  companyCode: string;
  contractNumber: string;
  nomenclature: LookupOption[];
  documentGroup: string;
}

export interface EncoderFormProps {
  document?: Document;
  triggerCloseModal: () => void;
}

export const EncoderForm = forwardRef(
  (props: EncoderFormProps, ref): ReactElement => {
    const { document, triggerCloseModal } = props;
    const {
      isLoading: isEncodeDocSaving,
      isError: hasEncodeDocError,
      mutateAsync: encodeDocumentAsync,
      reset: resetEncodeDocument,
    } = useEncodeDocument();

    const { control, watch, reset, handleSubmit, setValue, setError } =
      useForm<IEncoderFormValues>();

    const nomenclature = watch('nomenclature');

    const closeModal = (): void => {
      reset({
        qrBarCode: '',
        companyCode: '',
        contractNumber: '',
        nomenclature: [],
        documentGroup: '',
      });
      resetEncodeDocument();
      triggerCloseModal();
    };

    const encodeDocumentSubmit: SubmitHandler<IEncoderFormValues> = async (
      data,
    ): Promise<void> => {
      const {
        qrBarCode,
        companyCode,
        contractNumber,
        nomenclature,
        documentGroup,
      } = data;

      if (!nomenclature.length || nomenclature.length < 1) {
        setError('nomenclature', {
          type: 'required',
          message: 'Nomenclature is required',
        });
        return;
      }

      if (!documentGroup || documentGroup === '') {
        setError('documentGroup', {
          type: 'required',
          message: 'Document Group is required',
        });
        return;
      }

      if (
        (!qrBarCode || qrBarCode === '') &&
        (!companyCode || companyCode === '') &&
        (!contractNumber || contractNumber === '')
      ) {
        setError('qrBarCode', {
          type: 'required',
          message: 'QR BarCode is required',
        });
        setError('companyCode', {
          type: 'required',
          message: 'Company Code is required',
        });
        setError('contractNumber', {
          type: 'required',
          message: 'Contract Number is required',
        });
        return;
      } else if (
        (!qrBarCode || qrBarCode === '') &&
        contractNumber &&
        contractNumber !== '' &&
        (!companyCode || companyCode === '')
      ) {
        setError('companyCode', {
          type: 'required',
          message: 'Company Code is required',
        });
        return;
      } else if (
        (!qrBarCode || qrBarCode === '') &&
        companyCode &&
        companyCode !== '' &&
        (!contractNumber || contractNumber === '')
      ) {
        setError('contractNumber', {
          type: 'required',
          message: 'Contract Number is required',
        });
        return;
      }

      if (!document) {
        alert('Please select a document.');
        return;
      }

      const { label } = nomenclature[0];
      if (!isEncodeDocSaving) {
        await encodeDocumentAsync({
          documentId: document?.id as number,
          qrCode: qrBarCode,
          companyCode,
          contractNumber,
          nomenClature: label,
          documentGroup,
        });
        alert('Encode Saved.');
        closeModal();
      }
    };

    useEffect(
      function onChangeNomenclatureField() {
        const documentGroup =
          nomenclature && !!nomenclature.length
            ? nomenclature[0].documentGroup
            : '';

        setValue('documentGroup', documentGroup);
      },
      // eslint-disable-next-line
      [nomenclature],
    );

    useEffect(function initEncoderForm() {
      setValue('qrBarCode', document?.qrCode ?? '');
      // eslint-disable-next-line
    }, []);

    useImperativeHandle(ref, () => ({
      encodeDocument: () => {
        handleSubmit(encodeDocumentSubmit)().catch((error) => {
          alert(error);
        });
      },
    }));

    return (
      <>
        <Alert variant="danger" show={hasEncodeDocError}>
          Failed to encode.
        </Alert>
        <Card>
          <Card.Header className="text-center">BARCODE / QR CODE</Card.Header>
          <Card.Body>
            <FileInfo document={document} />
            <hr />
            <Form>
              <fieldset disabled={isEncodeDocSaving}>
                <QRBarcodeField control={control} />
                <h6 className="text-center">OR</h6>
                <CompanyCodeField control={control} />
                <ContractNumberField control={control} />
                <NomenclatureField control={control} />
                <DocumentGroupField control={control} />
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  },
);

export default EncoderForm;
