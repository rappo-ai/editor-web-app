const { hasAdminRole } = require('./auth');

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

function API_VALIDATE_ADMIN(user) {
  API_THROW_ERROR(
    !hasAdminRole(user),
    403,
    'Access denied - User needs to be an admin to perform this operation',
  );
}

function API_VALIDATE_AUTH_SCOPE(authInfo, scope) {
  API_THROW_ERROR(
    !authInfo.accessToken.scopes.includes('*') &&
      !authInfo.accessToken.scopes.includes(scope),
    403,
    `Access denied - User does not have the required scopes to perform this operation`,
  );
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
    ok: true,
    ...customData,
  };
}

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  ApiError,
  API_THROW_ERROR,
  API_SUCCESS_RESPONSE,
  API_VALIDATE_ADMIN,
  API_VALIDATE_AUTH_SCOPE,
  API_VALIDATE_QUERY_PARAMETERS,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
  asyncHandler,
};
