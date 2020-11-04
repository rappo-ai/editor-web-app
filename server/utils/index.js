function pojoClone(object) {
  const cloned = {};
  for (const key in object) {
    switch (typeof object[key]) {
      case 'object':
        {
          if (object[key]) {
            cloned[key] = pojoClone(object[key]);
          } else {
            cloned[key] = null;
          }
        }
        break;
      case 'undefined':
        cloned[key] = undefined;
        break;
      case 'function':
        // skip functions
        break;
      default:
        cloned[key] = object[key];
        break;
    }
  }
  return cloned;
}

module.exports = {
  pojoClone,
};
