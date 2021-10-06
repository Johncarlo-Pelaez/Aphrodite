import React, { useState } from 'react';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const S3_BUCKET = 'epds-aphrodite';
const REGION = 'ap-southeast-1';

AWS.config.update({
  accessKeyId: 'AKIA53VLFJXVVYTNO23G',
  secretAccessKey: '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',
});

const myBucket = new S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const STARTING_ITEM = 1;

export const S3Upload = () => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [itemNumber, setItemNumber] = useState(STARTING_ITEM);
  const [files, setFiles] = useState<FileList>();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      setFiles(files);
    }
  };

  const uploadFiles = () => {
    setStarted(true);
    uploadAgain(itemNumber);
  };

  const uploadAgain = (itemNumber: number) => {
    if (files) {
      const fileIndex = itemNumber - 1;
      const file = files[fileIndex];
      let nextItem = itemNumber + 1;

      uploadFile(file, () => {
        if (nextItem <= files.length) {
          uploadAgain(nextItem);
        } else {
          nextItem = STARTING_ITEM;
        }

        if (nextItem === STARTING_ITEM) {
          setStarted(false);
          setProgress(0);
        }

        setItemNumber(nextItem);
      });
    }
  };

  const uploadFile = (file: File, onComplete: () => void) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: 'docs/' + file.name,
    };

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .on('complete', () => {
        onComplete();
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <div>
      <h1>Uploading #{files && started ? itemNumber : ''}</h1>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        disabled={started}
      />
      <button onClick={() => uploadFiles()} disabled={started || !files}>
        Upload to S3
      </button>
    </div>
  );
};
