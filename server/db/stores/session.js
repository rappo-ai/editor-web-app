const session = require('express-session');
const FirestoreStore = require('firestore-store')(session);
const database = require('./firestore');

module.exports = new FirestoreStore({ database });
