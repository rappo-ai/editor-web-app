const { now } = require('lodash/date');
const { nanoid } = require('nanoid');

const db = require('../db');
const { USER_NULL, getScopesForRole } = require('./auth');
const { getUser } = require('./user');

async function generateAccessToken(user, role, expiryTs, isOneTimeUse = false) {
  const token = nanoid();
  const scopes = getScopesForRole(role);
  return db.create('tokens', {
    userId: user.id,
    token,
    scopes,
    isOneTimeUse,
    expiryTs,
  });
}

async function decodeToken(token) {
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
      : await getUser(accessToken.userId);
  return {
    accessToken,
    user,
  };
}

async function expireAccessTokens(user) {
  const oldTokens = await db.query('tokens', {
    property: 'userId',
    value: user.id,
  });

  const tokenExpiredPromises = [];
  oldTokens.forEach(oldToken => {
    tokenExpiredPromises.push(db.update(oldToken, { isExpired: true }));
  });

  return Promise.all(tokenExpiredPromises);
}

module.exports = {
  generateAccessToken,
  decodeToken,
  expireAccessTokens,
};
