import ApiError from './ApiError.js';

const handleMulterError = (error) => {
  const { code, field } = error;
  const fieldInfo = field ? ` for field '${field}'` : '';

  switch (code) {
    case 'LIMIT_FILE_SIZE':
      return new ApiError(
        413,
        `File size too large${fieldInfo}. Maximum limit exceeded.`,
      );

    case 'LIMIT_UNEXPECTED_FILE':
      return new ApiError(
        400,
        `Unexpected file field${fieldInfo}. Please check the field name.`,
      );

    case 'LIMIT_FILE_COUNT':
      return new ApiError(400, `Too many files uploaded${fieldInfo}.`);

    default:
      return new ApiError(400, 'File upload failed. Please try again.');
  }
};

export default handleMulterError;
