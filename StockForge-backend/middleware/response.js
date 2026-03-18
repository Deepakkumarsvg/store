const { sendSuccess, sendError } = require('../utils/responses');

const responseMiddleware = (req, res, next) => {
  res.success = ({ statusCode = 200, message, data, pagination, meta } = {}) =>
    sendSuccess(res, { statusCode, message, data, pagination, meta });

  res.fail = ({ statusCode = 500, message = 'Request failed', errors } = {}) =>
    sendError(res, { statusCode, message, errors });

  next();
};

module.exports = responseMiddleware;