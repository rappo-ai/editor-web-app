class ApiError extends Error {
  constructor(httpStatusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.httpStatusCode = httpStatusCode;
  }
}

function API_THROW_ERROR(assertion, httpStatusCode, message) {
  if (assertion) {
    throw new ApiError(httpStatusCode, message);
  }
}

function API_VALIDATE_QUERY_PARAMETERS(params) {
  Object.keys(params).forEach(key => {
    if (!params[key]) {
      throw new ApiError(400, `Missing required query parameter '${key}'`);
    }
  });
}

function API_VALIDATE_REQUEST_BODY_PARAMETERS(params) {
  Object.keys(params).forEach(key => {
    if (!params[key]) {
      throw new ApiError(
        400,
        `Missing required request body parameter '${key}'`,
      );
    }
  });
}

function API_SUCCESS_RESPONSE(customData) {
  return {
    response: 'success',
    ...customData,
  };
}

function API_ERROR_RESPONSE(customData) {
  return {
    response: 'error',
    ...customData,
  };
}

module.exports = {
  ApiError,
  API_THROW_ERROR,
  API_SUCCESS_RESPONSE,
  API_ERROR_RESPONSE,
  API_VALIDATE_QUERY_PARAMETERS,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
};
