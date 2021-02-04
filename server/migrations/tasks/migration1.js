const { get: getObjectKey, has: hasObjectKey } = require('lodash/object');
const {
  USER_ROLE_BOT_END_USER_CREATOR,
  USER_ROLE_WEB_APP_USER,
  USER_ROLE_SUPER_ADMIN,
} = require('../../utils/auth');

const name = 'migration1';
const prefix = '';
const doReinitialize = true;

async function reinitialize(db, collection) {
  if (!doReinitialize) {
    return null;
  }
  // delete collection
  return db.delete(`${prefix}${collection}`);
}

async function migrateUsers(db) {
  console.log('migrating users');
  await reinitialize(db, 'users');

  // load data from googleuser and user
  await db.get('googleuser').then(googleusers => {
    const promises = [];
    googleusers.forEach(googleuser => {
      promises.push(
        db.get('user', googleuser.userid).then(user => {
          let waitlistProfile = {};
          if (
            hasObjectKey(user, 'profile.linkedinUrl') ||
            hasObjectKey(user, 'profile.phoneNumber') ||
            hasObjectKey(user, 'profile.useCase')
          ) {
            waitlistProfile = {
              waitlist: {
                linkedinUrl: getObjectKey(user, 'profile.linkedinUrl', ''),
                phoneNumber: getObjectKey(user, 'profile.phoneNumber', ''),
                useCase: getObjectKey(user, 'profile.useCase', ''),
              },
            };
          }
          db.create(`${prefix}users`, {
            id: googleuser.userid,
            collection: `${prefix}users`,
            isActivated: user.isActivated || false,
            role:
              getObjectKey(googleuser.profile, 'emails[0].value', '') ===
              'superadmin@rappo.ai'
                ? USER_ROLE_SUPER_ADMIN
                : USER_ROLE_WEB_APP_USER,
            profiles: {
              google: googleuser.profile,
              rappo: {
                emailId: getObjectKey(
                  googleuser.profile,
                  'emails[0].value',
                  '',
                ),
                displayName: getObjectKey(
                  googleuser.profile,
                  'displayName',
                  '',
                ),
                givenName: getObjectKey(
                  googleuser.profile,
                  'name.givenName',
                  '',
                ),
                familyName: getObjectKey(
                  googleuser.profile,
                  'name.familyName',
                  '',
                ),
                profilePic: getObjectKey(
                  googleuser.profile,
                  'photos[0].value',
                  '',
                ),
              },
              ...waitlistProfile,
            },
          });
        }),
      );
    });
    return Promise.all(promises);
  });
  console.log('migrating users complete');
}

async function migrateBots(db) {
  console.log('migrating bots');
  await reinitialize(db, 'bots');

  // load data from bot
  await db.get('bot').then(bots => {
    const promises = [];
    bots.forEach(bot => {
      promises.push(
        db
          .get('user', {
            property: 'botid',
            value: bot.id,
          })
          .then(botuser => {
            if (botuser) {
              return db.create(`${prefix}users`, {
                id: botuser.id,
                collection: `${prefix}users`,
                isActivated: true,
                role: USER_ROLE_BOT_END_USER_CREATOR,
                profiles: {
                  rappo: {
                    displayName: bot.name,
                    profilePic: '',
                    emailId: '',
                    givenName: '',
                    familyName: '',
                  },
                },
                botId: bot.id,
              });
            }
            return null;
          })
          .then(botuser => {
            if (botuser) {
              return db.create(`${prefix}bots`, {
                id: bot.id,
                collection: `${prefix}bots`,
                name: bot.name,
                ownerId: bot.userid,
              });
            }
            return null;
          }),
      );
    });
    return Promise.all(promises);
  });
  console.log('migrating bots complete');
}

async function migrateModels(db) {
  console.log('migrating models');
  await reinitialize(db, 'models');

  // load data from model
  await db.get('model').then(models => {
    const promises = [];
    models.forEach(model => {
      promises.push(
        db.create(`${prefix}models`, {
          id: model.id,
          collection: `${prefix}models`,
          botId: model.botid,
          ownerId: model.userid,
          states: model.states,
          transitions: model.transitions,
        }),
      );
    });
    return Promise.all(promises);
  });
  console.log('migrating models complete');
}

async function start(db) {
  await migrateUsers(db);
  await migrateBots(db);
  await migrateModels(db);
}

module.exports = {
  name,
  start,
};
