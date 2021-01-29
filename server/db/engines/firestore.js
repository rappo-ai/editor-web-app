/* eslint-disable no-param-reassign */
const { Firestore } = require('@google-cloud/firestore');
const { DBEngine } = require('./_base');
const { pojoClone, cloneFromPojo } = require('../../utils/pojo');

class FirestoreDBEngine extends DBEngine {
  constructor(entityFactory) {
    super();
    this.firestore = new Firestore();
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

  async querySnapshot(collection, query) {
    if (Array.isArray(query)) {
      let firestoreQuery = this.firestore
        .collection(collection)
        .withConverter(this.converter);

      const queries = query;
      queries.forEach(_query => {
        if (!_query.condition) {
          _query.condition = '==';
        }
        firestoreQuery = firestoreQuery.where(
          _query.property,
          _query.condition,
          _query.value,
        );
      });

      return firestoreQuery.get();
    }

    if (!query.condition) {
      query.condition = '==';
    }
    return this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .where(query.property, query.condition, query.value)
      .get();
  }

  async query(collection, query) {
    return this.querySnapshot(collection, query).then(querySnapshot => {
      const results = [];
      querySnapshot.forEach(doc => {
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

  async delete(collection, id) {
    return this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .doc(id)
      .delete();
  }

  async deleteAll(collection, query) {
    if (!query.condition) {
      query.condition = '==';
    }
    return this.querySnapshot(collection, query).then(querySnapshot => {
      const results = [];
      querySnapshot.forEach(doc => {
        results.push(doc.ref.delete());
      });
      return results;
    });
  }
}

module.exports = {
  FirestoreDBEngine,
};
