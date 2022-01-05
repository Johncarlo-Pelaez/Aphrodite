import { ReactElement, useEffect } from 'react';
import { getApiAuthorization, getApiAccessToken } from 'apis';

export interface PdfViewerProps {
  documentId?: number;
}

export const PdfViewer = (props: PdfViewerProps): ReactElement => {
  const { documentId } = props;

  const getPDFViewerInstance = (): any => {
    const pdfViewerIframe = document.getElementById(
      'iframeDocViewer',
    ) as HTMLIFrameElement;
    const pdfViewerIframeWindow: any = pdfViewerIframe?.contentWindow;
    return pdfViewerIframeWindow?.PDFViewerApplication;
  };

  const loadPdf = (): void => {
    const PDFViewerApplication = getPDFViewerInstance();

    if (!!PDFViewerApplication && !documentId) {
      PDFViewerApplication.close();
      return;
    }

    if (!PDFViewerApplication || !documentId) return;

    PDFViewerApplication.close();
    PDFViewerApplication.loadingBar.show();
    PDFViewerApplication.loadingBar.percent = 0;
    PDFViewerApplication.open(`/api/documents/${documentId}/file`, {
      httpHeaders: {
        Authorization: getApiAuthorization(),
        'access-token': getApiAccessToken(),
      },
    }).catch((error: Object) => {
      PDFViewerApplication.loadingBar.hide();
    });
  };

  const resetPdfViewer = (): void => {
    const PDFViewerApplication = getPDFViewerInstance();
    if (PDFViewerApplication) PDFViewerApplication.close();
  };

  useEffect(loadPdf, [documentId]);
  // eslint-disable-next-line
  useEffect(() => resetPdfViewer, []);

  return (
    <iframe
      className="pdf-viewer"
      title="PDF document viewer"
      id="iframeDocViewer"
      src="/pdfjs/web/viewer.html"
      onLoad={loadPdf}
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  );
};

export default PdfViewer;
