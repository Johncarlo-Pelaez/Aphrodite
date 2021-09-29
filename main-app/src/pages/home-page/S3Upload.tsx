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

export const S3Upload = () => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (file: any) => {
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
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <div>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
  );
};
