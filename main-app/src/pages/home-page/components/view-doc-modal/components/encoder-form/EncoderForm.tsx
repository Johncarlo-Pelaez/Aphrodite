import {
  ReactElement,
  Fragment,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Document, EncodeValues } from 'models';
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
  onSubmitted: () => void;
}

export const EncoderForm = forwardRef(
  (props: EncoderFormProps, ref): ReactElement => {
    const { document, onSubmitted: triggerSubmitted } = props;
    const envodeValues = useMemo(() => {
      if (document?.encodeValues !== '')
        return JSON.parse(document?.encodeValues as string) as EncodeValues;
    }, [document?.encodeValues]);

    const {
      isLoading: isEncodeDocSaving,
      isError: hasEncodeDocError,
      mutateAsync: encodeDocumentAsync,
      reset: resetEncodeDocument,
    } = useEncodeDocument();

    const {
      control,
      watch,
      reset,
      handleSubmit,
      setValue,
      setError,
      setFocus,
    } = useForm<IEncoderFormValues>({
      defaultValues: {
        qrBarCode: document?.qrCode,
        companyCode: envodeValues?.companyCode,
        contractNumber: envodeValues?.contractNumber,
        nomenclature:
          envodeValues?.nomenclature && envodeValues?.documentGroup
            ? [
                {
                  label: envodeValues?.nomenclature,
                  documentGroup: envodeValues?.documentGroup,
                },
              ]
            : [],
      },
    });

    const nomenclature = watch('nomenclature');

    const encodeDocumentSubmit: SubmitHandler<IEncoderFormValues> = async (
      data,
    ): Promise<void> => {
      const {
        qrBarCode,
        companyCode,
        contractNumber,
        nomenclature: arrNomenclature,
        documentGroup,
      } = data;

      if (!document) {
        alert('Please select a document.');
        return;
      }

      const isQRBarCodeInputEmpty = !qrBarCode || qrBarCode === '';
      const isNomenclatureInputEmpty =
        !arrNomenclature || arrNomenclature?.length < 1;
      const isDocumentGroupInputEmpty = !documentGroup || documentGroup === '';
      const isCompanyCodeInputEmpty = !companyCode || companyCode === '';
      const isContractNumberInputEmpty =
        !contractNumber || contractNumber === '';

      if (
        !isCompanyCodeInputEmpty &&
        !isContractNumberInputEmpty &&
        isNomenclatureInputEmpty
      ) {
        setError('nomenclature', {
          type: 'required',
          message: 'Nomenclature is required',
        });
        return;
      }

      if (!isNomenclatureInputEmpty && isDocumentGroupInputEmpty) {
        setError('documentGroup', {
          type: 'required',
          message: 'Document Group is required',
        });
        return;
      }

      if (
        isQRBarCodeInputEmpty &&
        isCompanyCodeInputEmpty &&
        isContractNumberInputEmpty
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
        isQRBarCodeInputEmpty &&
        !isContractNumberInputEmpty &&
        isCompanyCodeInputEmpty
      ) {
        setError('companyCode', {
          type: 'required',
          message: 'Company Code is required',
        });
        return;
      } else if (
        isQRBarCodeInputEmpty &&
        !isCompanyCodeInputEmpty &&
        isContractNumberInputEmpty
      ) {
        setError('contractNumber', {
          type: 'required',
          message: 'Contract Number is required',
        });
        return;
      }

      const nomenclature = !!arrNomenclature?.length
        ? arrNomenclature[0].label
        : '';

      if (!isEncodeDocSaving) {
        await encodeDocumentAsync({
          documentId: document?.id as number,
          qrBarCode,
          companyCode,
          contractNumber,
          nomenclature,
          documentGroup,
          isQRBarCode: !isQRBarCodeInputEmpty,
        });

        alert('Encode Saved.');
        triggerSubmitted();
      }
    };

    useEffect(
      function onChangeNomenclatureField() {
        setValue(
          'documentGroup',
          !!nomenclature?.length ? nomenclature[0].documentGroup : '',
        );
      },
      // eslint-disable-next-line
      [nomenclature],
    );

    useImperativeHandle(ref, () => ({
      encodeDocument: () => {
        handleSubmit(encodeDocumentSubmit)();
      },
    }));

    useEffect(() => {
      return function componentCleanUp() {
        reset({
          qrBarCode: '',
          companyCode: '',
          contractNumber: '',
          nomenclature: [],
          documentGroup: '',
        });
        resetEncodeDocument();
      };
      // eslint-disable-next-line
    }, []);

    useEffect(() => setFocus('qrBarCode'), [document, setFocus]);

    return (
      <Fragment>
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
      </Fragment>
    );
  },
);

export default EncoderForm;
