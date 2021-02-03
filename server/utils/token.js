const { now } = require('lodash/date');
const { get: getObjectKey } = require('lodash/object');
const { nanoid } = require('nanoid');

const {
  USER_NULL,
  USER_ROLE_SUPER_ADMIN,
  USER_ROLE_WEB_APP_USER,
  getScopesForRole,
} = require('./auth');
const { getUser } = require('./user');

const TOKEN_EXPIRY_1_HOUR = 'token_expiry_1_hour';
const TOKEN_EXPIRY_1_DAY = 'token_expiry_1_day';
const TOKEN_EXPIRY_1_WEEK = 'token_expiry_1_week';
const TOKEN_EXPIRY_1_MONTH = 'token_expiry_1_month';
const TOKEN_EXPIRY_1_YEAR = 'token_expiry_1_year';
const TOKEN_EXPIRY_NEVER = 'token_expiry_never';

function getTokenExpiryTs(tokenExpiry) {
  switch (tokenExpiry) {
    case TOKEN_EXPIRY_1_HOUR:
      return now() + 60 * 60 * 1000; // hour in milliseconds
    case TOKEN_EXPIRY_1_DAY:
      return now() + 24 * 60 * 60 * 1000; // 24 hours
    case TOKEN_EXPIRY_1_WEEK:
      return now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    case TOKEN_EXPIRY_1_MONTH:
      return now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    case TOKEN_EXPIRY_1_YEAR:
      return now() + 365 * 24 * 60 * 60 * 1000; // 365 days
    case TOKEN_EXPIRY_NEVER:
      return now() + 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
    default:
      break;
  }
  return now(); // expire the token immediately for invalid values
}
async function generateAccessToken(
  db,
  user,
  role,
  tokenExpiry,
  isOneTimeUse = false,
) {
  const token = nanoid();
  const scopes = getScopesForRole(role);
  const expiryTs = getTokenExpiryTs(tokenExpiry);
  return db.create('tokens', {
    userId: user.id,
    token,
    scopes,
    isOneTimeUse,
    expiryTs,
  });
}

async function generateWebAppAccessToken(db, user) {
  const role =
    getObjectKey(user, 'profiles.google.emails[0].value', '') ===
    'superadmin@rappo.ai'
      ? USER_ROLE_SUPER_ADMIN
      : USER_ROLE_WEB_APP_USER;
  const tokenExpiry =
    role === USER_ROLE_SUPER_ADMIN ? TOKEN_EXPIRY_1_HOUR : TOKEN_EXPIRY_1_DAY;
  return generateAccessToken(db, user, role, tokenExpiry);
}

async function decodeToken(db, token) {
  const accessToken = await db.get('tokens', {
    property: 'token',
    value: token,
  });

  const user =
    !accessToken || !accessToken.userId
      ? USER_NULL
      : await getUser(db, accessToken.userId);

  return {
    accessToken,
    user,
  };
}

async function revokeAllUserAccessTokens(db, user) {
  const oldTokens = await db.query('tokens', [
    {
      property: 'userId',
      value: user.id,
    },
    { property: 'isRevoked', value: false },
  ]);

  const tokenRevokedPromises = [];
  oldTokens.forEach(oldToken => {
    tokenRevokedPromises.push(db.update(oldToken, { isRevoked: true }));
  });

  return Promise.all(tokenRevokedPromises);
}

async function revokeAccessToken(db, token) {
  return db
    .get('tokens', {
      property: 'token',
      value: token,
    })
    .then(accessToken => db.update(accessToken, { isRevoked: true }));
}

function isTokenExpired(accessToken) {
  return now() >= accessToken.expiryTs;
}

module.exports = {
  TOKEN_EXPIRY_1_HOUR,
  TOKEN_EXPIRY_1_DAY,
  TOKEN_EXPIRY_1_WEEK,
  TOKEN_EXPIRY_1_MONTH,
  TOKEN_EXPIRY_1_YEAR,
  TOKEN_EXPIRY_NEVER,
  decodeToken,
  revokeAccessToken,
  revokeAllUserAccessTokens,
  generateAccessToken,
  generateWebAppAccessToken,
  getTokenExpiryTs,
  isTokenExpired,
};
