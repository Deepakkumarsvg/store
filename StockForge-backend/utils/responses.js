const successPayload = ({ message, data, pagination, meta } = {}) => {
  const payload = { success: true };

  if (message) payload.message = message;
  if (data !== undefined) payload.data = data;
  if (pagination) payload.pagination = pagination;
  if (meta) payload.meta = meta;

  return payload;
};

const errorPayload = ({ message = 'Request failed', errors } = {}) => {
  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return payload;
};

const sendSuccess = (res, { statusCode = 200, message, data, pagination, meta } = {}) => {
  return res.status(statusCode).json(successPayload({ message, data, pagination, meta }));
};

const sendError = (res, { statusCode = 500, message = 'Request failed', errors } = {}) => {
  return res.status(statusCode).json(errorPayload({ message, errors }));
};

module.exports = {
  successPayload,
  errorPayload,
  sendSuccess,
  sendError,
};