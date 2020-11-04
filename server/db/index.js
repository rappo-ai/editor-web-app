const factory = require('./factory');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { Entity } = require('./entities/_base');

function loadEntities(entitiesDir) {
  let entities = {};
  let files = fs.readdirSync(entitiesDir);

  files.forEach(file => {
    const filename = path.basename(file, path.extname(file));
    if (filename === '_base') {
      return;
    }
    const name = filename;
    assert(entities[name] === undefined);

    const entity = require(path.resolve(__dirname, entitiesDir, file));
    assert(entity.class !== undefined);

    factory.register(name, () => new entity.class());

    entities[name] = entity;
  });

  return entities;
}

function init(options) {
  if (!options) {
    options = {};
  }
  if (!options.dbengine) {
    options.dbengine = 'firestore';
  }
  let db = {};
  switch (options.dbengine) {
    case 'firestore':
      const { FirestoreDBEngine } = require('./engines/firestore');
      db.engine = new FirestoreDBEngine(factory);
      break;
    default:
      throw new Error(`Engine ${options.dbengine} not implemented`);
  }

  db.entities = loadEntities(path.resolve(__dirname, './entities'));

  db.create = async function(collection) {
    const entity = factory.create(collection);
    return db.engine.create(collection, entity);
  };

  db.get = async function(collection, query) {
    return db.engine.get(collection, query);
  };

  db.set = async function(collection, entity) {
    return db.engine.set(collection, entity);
  };

  Entity.db = db;

  return db;
}

const db = init();

module.exports = db;
