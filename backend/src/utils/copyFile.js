const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = (fileKey) => {
  if (process.env.STORAGE_TYPE === 's3') {
  } else {
    try {
      const thumbnailOriginalName = fileKey;
      const thumbnailCopyName = `${crypto
        .randomBytes(16)
        .toString('hex')}${thumbnailOriginalName.substring(32)}`;

      fs.copyFileSync(
        `${path.resolve(
          __dirname,
          '..',
          '..',
          'tmp',
          'uploads'
        )}/${thumbnailOriginalName}`,
        `${path.resolve(
          __dirname,
          '..',
          '..',
          'tmp',
          'uploads'
        )}/${thumbnailCopyName}`,
        fs.constants.COPYFILE_EXCL
      );

      return thumbnailCopyName;
    } catch (error) {
      throw error;
    }
  }
};
