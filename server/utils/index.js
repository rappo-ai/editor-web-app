/* eslint-disable guard-for-in, no-restricted-syntax, no-param-reassign */
function pojoClone(object) {
  const cloned = Array.isArray(object) ? [] : {};

  function pojoCloneInternal(value) {
    let clonedInternal = value;
    switch (typeof value) {
      case 'object':
        if (value) {
          clonedInternal = pojoClone(value);
        } else {
          clonedInternal = null;
        }
        break;
      case 'undefined':
        clonedInternal = undefined;
        break;
      case 'function':
        // skip functions
        break;
      default:
        break;
    }
    return clonedInternal;
  }
  if (Array.isArray(object)) {
    object.forEach(value => {
      cloned.push(pojoCloneInternal(value));
    });
  } else {
    for (const key in object) {
      cloned[key] = pojoCloneInternal(object[key]);
    }
  }
  return cloned;
}

function cloneFromPojo(entity, pojo) {
  for (const key in pojo) {
    entity[key] = pojo[key];
  }
}
module.exports = {
  pojoClone,
  cloneFromPojo,
};
