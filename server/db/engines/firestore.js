const { DBEngine } = require('./_base');
const { Firestore } = require('@google-cloud/firestore');
const { pojoClone } = require('../../utils');
const { factory } = require('../factory');

class FirestoreDBEngine extends DBEngine {
  constructor() {
    super();
    this.firestore = new Firestore();
    this.converter = {
      toFirestore(entity) {
        return pojoClone(entity);
      },
      fromFirestore(snapshot) {
        const data = snapshot.data();
        const obj = factory.get(data.type);
        for (const key in data) {
          obj[key] = data[key];
        }
        return obj;
      },
    };
  }

  async findById(collection, id) {
    const snapshot = await this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .doc(id)
      .get();
    return snapshot.data();
  }

  async findByProperty(collection, property, value) {
    const snapshot = await this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .where(property, '==', value)
      .get();
    const retVal = [];
    snapshot.forEach(doc => {
      retVal.push(doc.get());
    });
    return retVal;
  }

  async add(collection, item) {
    const docRef = this.firestore
      .collection(collection)
      .withConverter(this.converter)
      .doc(item.id);
    return await docRef.set(item);
  }
}

module.exports = {
  FirestoreDBEngine,
};
