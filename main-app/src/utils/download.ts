export { downloadFile };

type DownloadFileParams = {
  file: Blob;
  filename: string;
};

const downloadFile = (params: DownloadFileParams): void => {
  const { file, filename } = params;

  const blob = new Blob([file], {
    type: 'application/octet-stream',
  });
  const linkElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);

  linkElement.href = href;
  linkElement.download = filename;

  document.body.appendChild(linkElement);

  linkElement.click();

  document.body.removeChild(linkElement);
  window.URL.revokeObjectURL(href);
};
