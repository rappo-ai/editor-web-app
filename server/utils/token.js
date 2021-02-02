const { now } = require('lodash/date');
const { nanoid } = require('nanoid');

const {
  USER_NULL,
  USER_ROLE_BOT_DESIGNER,
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

async function generateBotDesignerAccessToken(db, user) {
  return generateAccessToken(
    db,
    user,
    USER_ROLE_BOT_DESIGNER,
    TOKEN_EXPIRY_1_DAY,
  );
}

async function decodeToken(db, token) {
  const accessToken = await db.get('tokens', {
    property: 'token',
    value: token,
  });

  if (accessToken) {
    const isTokenDateExpired = now() >= accessToken.expiryTs;
    if (isTokenDateExpired) {
      await db.update(accessToken, { isExpired: true });
    }
  }

  const user =
    !accessToken || !accessToken.userId
      ? USER_NULL
      : await getUser(db, accessToken.userId);
  return {
    accessToken,
    user,
  };
}

async function expireAllUserAccessTokens(db, user) {
  const oldTokens = await db.query('tokens', [
    {
      property: 'userId',
      value: user.id,
    },
    { property: 'isExpired', value: false },
  ]);

  const tokenExpiredPromises = [];
  oldTokens.forEach(oldToken => {
    tokenExpiredPromises.push(db.update(oldToken, { isExpired: true }));
  });

  return Promise.all(tokenExpiredPromises);
}

async function expireAccessToken(db, token) {
  const accessToken = await db.get('tokens', {
    property: 'token',
    value: token,
  });
  return db.update(accessToken, { isExpired: true });
}

module.exports = {
  TOKEN_EXPIRY_1_HOUR,
  TOKEN_EXPIRY_1_DAY,
  TOKEN_EXPIRY_1_WEEK,
  TOKEN_EXPIRY_1_MONTH,
  TOKEN_EXPIRY_1_YEAR,
  TOKEN_EXPIRY_NEVER,
  decodeToken,
  expireAccessToken,
  expireAllUserAccessTokens,
  generateAccessToken,
  generateBotDesignerAccessToken,
  getTokenExpiryTs,
};
