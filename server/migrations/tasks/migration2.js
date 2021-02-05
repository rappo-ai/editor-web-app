const name = 'migration2';
const description = 'adding deployments key to every bot';

async function patchBots(db) {
  console.log('patching bots');

  await db.get('bots').then(bots => {
    const promises = [];
    bots.forEach(bot => {
      if (!bot.deployments) {
        promises.push(db.update(bot, { deployments: {} }));
      }
    });
    return Promise.all(promises);
  });
  console.log('patching bots complete');
}

async function start(db) {
  await patchBots(db);
}

module.exports = {
  name,
  description,
  start,
};
