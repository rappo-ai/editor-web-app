const db = require('../../db');
const { USER_ROLE_BOT_END_USER_CREATOR } = require('../../utils/auth');
const {
  generateAccessToken,
  expireAllUserAccessTokens,
  TOKEN_EXPIRY_NEVER,
} = require('../../utils/token');

async function publishWeb(bot) {
  const botEndUserCreator = await db.get('users', [
    {
      property: 'botId',
      value: bot.id,
    },
    { property: 'role', value: USER_ROLE_BOT_END_USER_CREATOR },
  ]);

  await expireAllUserAccessTokens(db, botEndUserCreator);

  const accessToken = await generateAccessToken(
    db,
    botEndUserCreator,
    USER_ROLE_BOT_END_USER_CREATOR,
    TOKEN_EXPIRY_NEVER,
  );

  return { accessToken: accessToken.token, botId: bot.id };
}

async function unpublishWeb(bot) {
  const botEndUserCreator = await db.get('users', {
    property: 'botId',
    value: bot.id,
  });

  await expireAllUserAccessTokens(db, botEndUserCreator);

  return { accessToken: '', botId: bot.id };
}

module.exports = {
  publishWeb,
  unpublishWeb,
};
