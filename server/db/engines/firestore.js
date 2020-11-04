const { DBEngine } = require('./_base');
const { Firestore } = require('@google-cloud/firestore');
const { pojoClone } = require('../../utils');

class FirestoreDBEngine extends DBEngine {
  constructor(factory) {
    super();
    this.firestore = new Firestore();
    this.converter = {
      toFirestore(entity) {
        return pojoClone(entity);
      },
      fromFirestore(snapshot) {
        const data = snapshot.data();
        const obj = factory.create(data.collection);
        for (const key in data) {
          obj[key] = data[key];
        }
        return obj;
      },
    };
  }

  async create(collection, entity) {
    return this.set(collection, entity).then(() => {
      return entity;
    });
  }

  async get(collection, query) {
    if (typeof query === 'string') {
      const id = query;
      return this.firestore
        .collection(collection)
        .withConverter(this.converter)
        .doc(id)
        .get()
        .then(snapshot => {
          return snapshot.data();
        });
    } else {
      return this.query(collection, query).then(results => {
        if (results.length === 0) {
          return null;
        }
        return results[0];
      });
    }
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
      .then(() => {
        return entity;
      });
  }
}

module.exports = {
  FirestoreDBEngine,
};
