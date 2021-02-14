const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

module.exports = (fileKey) => {
  if (process.env.STORAGE_TYPE === 's3') {
    // return s3
    //   .deleteObject({
    //     Bucket: process.env.BUCKET_NAME,
    //     Key: fileKey,
    //   })
    //   .promise()
    //   .then((response) => {
    //     console.log(response.status);
    //   })
    //   .catch((response) => {
    //     console.log(response.status);
    //   });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', 'tmp', 'uploads', fileKey)
    );
  }
};
