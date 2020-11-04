/* eslint-disable global-require, no-param-reassign, no-case-declarations */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { Entity } = require('./entities/_base');
const entityFactory = require('./entities/_factory');

function loadEntities(entitiesDir) {
  const entities = {};
  const files = fs.readdirSync(entitiesDir);

  files.forEach(file => {
    const filename = path.basename(file, path.extname(file));
    if (filename.startsWith('_')) {
      return;
    }
    const name = filename;
    assert(entities[name] === undefined);

    const entity = require(path.resolve(__dirname, entitiesDir, file));
    assert(entity.class !== undefined);

    entityFactory.register(name, () => new entity.Class());

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
  const db = {};
  switch (options.dbengine) {
    case 'firestore':
      const { FirestoreDBEngine } = require('./engines/firestore');
      db.engine = new FirestoreDBEngine(entityFactory);
      break;
    default:
      throw new Error(`Engine ${options.dbengine} not implemented`);
  }

  db.entities = loadEntities(path.resolve(__dirname, './entities'));

  db.create = async function(collection) {
    const entity = entityFactory.create(collection);
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
