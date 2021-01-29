const { now } = require('lodash/date');

const TOKEN_EXPIRY_1_HOUR = () => now() + 60 * 60 * 1000; // hour in milliseconds
const TOKEN_EXPIRY_1_DAY = () => now() + 24 * 60 * 60 * 1000; // 24 hours
const TOKEN_EXPIRY_1_WEEK = () => now() + 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_EXPIRY_1_MONTH = () => now() + 30 * 24 * 60 * 60 * 1000; // 30 days
const TOKEN_EXPIRY_1_YEAR = () => now() + 365 * 24 * 60 * 60 * 1000; // 365 days
const TOKEN_EXPIRY_NEVER = () => now() + 100 * 365 * 24 * 60 * 60 * 1000; // 100 years

const USER_NULL = {
  id: 'null',
};
const USER_SERVICE_ADMIN = {
  id: 'serviceadmin',
};

const USER_ROLE_SUPER_ADMIN = 'super_admin';
const USER_ROLE_SIGNUP_APPROVER = 'signup_approver';
const USER_ROLE_BOT_DESIGNER = 'bot_designer';
const USER_ROLE_BOT_END_USER_CREATOR = 'bot_end_user_creator';
const USER_ROLE_END_USER = 'end_user';

const SCOPES_SUPER_ADMIN = ['*'];
const SCOPES_SIGNUP_APPROVER = ['GET /api/v1/users/:userId/approve'];
const SCOPES_BOT_DESIGNER = [
  'GET /api/v1/bots',
  'POST /api/v1/bots',
  'GET /api/v1/bots/:botId',
  'GET /api/v1/bots/:botId/models',
  'POST /api/v1/bots/:botId/deployments/:runtime',
  'DELETE /api/v1/bots/:botId/deployments/:runtime',
  'POST /api/v1/models',
  'GET /api/v1/models/:modelId',
  'POST /api/v1/models/:modelId/states',
  'PUT /api/v1/models/:modelId/states/:stateId',
  'DELETE /api/v1/models/:modelId/states/:stateId',
  'POST /api/v1/models/:modelId/transitions',
  'DELETE /api/v1/models/:modelId/transitions/:transitionId',
  'GET /api/v1/models/:modelId/states',
  'GET /api/v1/users/:userId',
  'PUT /api/v1/users/:userId/profiles/:profileName',
];
const SCOPES_BOT_END_USER_CREATOR = [
  'GET /api/v1/users',
  'POST /api/v1/users',
  'GET /api/v1/users/:userId',
];
const SCOPES_END_USER = [
  'GET /api/v1/bots/:botId',
  'GET /api/v1/bots/:botId/models',
  'GET /api/v1/models/:modelId',
  'GET /api/v1/models/:modelId/states',
  'GET /api/v1/users/:userId',
];

function getScopesForRole(role) {
  switch (role) {
    case USER_ROLE_SUPER_ADMIN:
      return SCOPES_SUPER_ADMIN;
    case USER_ROLE_SIGNUP_APPROVER:
      return SCOPES_SIGNUP_APPROVER;
    case USER_ROLE_BOT_DESIGNER:
      return SCOPES_BOT_DESIGNER;
    case USER_ROLE_BOT_END_USER_CREATOR:
      return SCOPES_BOT_END_USER_CREATOR;
    case USER_ROLE_END_USER:
      return SCOPES_END_USER;
    default:
      break;
  }
  return [];
}

function hasAdminRole(user) {
  return user.role === USER_ROLE_SUPER_ADMIN;
}

module.exports = {
  TOKEN_EXPIRY_1_HOUR,
  TOKEN_EXPIRY_1_DAY,
  TOKEN_EXPIRY_1_WEEK,
  TOKEN_EXPIRY_1_MONTH,
  TOKEN_EXPIRY_1_YEAR,
  TOKEN_EXPIRY_NEVER,
  USER_NULL,
  USER_SERVICE_ADMIN,
  USER_ROLE_SUPER_ADMIN,
  USER_ROLE_SIGNUP_APPROVER,
  USER_ROLE_BOT_DESIGNER,
  USER_ROLE_BOT_END_USER_CREATOR,
  USER_ROLE_END_USER,
  getScopesForRole,
  hasAdminRole,
};
