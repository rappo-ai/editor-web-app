const db = require('../db');
const { USER_NULL, USER_SERVICE_ADMIN } = require('./auth');

async function getUser(id) {
  switch (id) {
    case USER_NULL.id:
      return USER_NULL;
    case USER_SERVICE_ADMIN.id:
      return USER_SERVICE_ADMIN;
    default:
      break;
  }
  return db.get('users', id);
}

module.exports = {
  getUser,
};
