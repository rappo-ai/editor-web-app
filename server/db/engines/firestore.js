/* eslint-disable no-param-reassign */
const { Firestore } = require('@google-cloud/firestore');
const { DBEngine } = require('./_base');
const { pojoClone, cloneFromPojo } = require('../../utils');

class FirestoreDBEngine extends DBEngine {
  constructor(entityFactory) {
    super();
    this.firestore = new Firestore({
      projectId: process.env.FIRESTORE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIRESTORE_CLIENT_EMAIL,
        private_key: process.env.FIRESTORE_PRIVATE_KEY,
      },
    });
    this.converter = {
      toFirestore(entity) {
        return pojoClone(entity);
      },
      fromFirestore(snapshot) {
        const data = snapshot.data();
        const entity = entityFactory.create(data.collection);
        cloneFromPojo(entity, data);
        return entity;
      },
    };
  }

  async create(collection, entity) {
    return this.set(collection, entity).then(() => entity);
  }

  async get(collection, query) {
    if (typeof query === 'string') {
      const id = query;
      return this.firestore
        .collection(collection)
        .withConverter(this.converter)
        .doc(id)
        .get()
        .then(snapshot => snapshot.data());
    }
    return this.query(collection, query).then(results => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
  }

  async query(collection, query) {
    if (!query.condition) {
      query.condition = '==';
    }
    return this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .where(query.property, query.condition, query.value)
      .get()
      .then(snapshot => {
        const results = [];
        snapshot.forEach(doc => {
          results.push(doc.data());
        });
        return results;
      });
  }

  async set(collection, entity) {
    return this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .doc(entity.id)
      .set(entity)
      .then(() => entity);
  }
}

module.exports = {
  FirestoreDBEngine,
};
