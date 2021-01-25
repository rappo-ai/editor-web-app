const db = require('../../db');

async function publishWeb(bot, params) {
  await db.deleteAll('accesstoken', {
    property: 'botid',
    value: bot.id,
  });

  const accessToken = await db.create('accesstoken');
  accessToken.set('botid', bot.id);
  await bot.set('webtoken', accessToken.value);
  await bot.set('webparams', params);

  return { accessToken: accessToken.value, botId: bot.id };
}

async function unpublishWeb(bot) {
  // destroy access token used to generate end-users
  await db.delete('accesstoken', {
    property: 'botid',
    value: bot.id,
  });

  await bot.set('webtoken', '');

  return { accessToken: '' };
}

module.exports = {
  publishWeb,
  unpublishWeb,
};
