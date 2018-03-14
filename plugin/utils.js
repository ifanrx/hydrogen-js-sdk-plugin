module.exports = {
  extend: function(dist, src) {
    return Object.assign(dist, src)
  },

  isString: function(value) {
    const type = typeof value
    return type == 'string'
  },

  cloneDeep: function(object) {
    const newObject = Object.assign({}, object);
    Object.keys(newObject)
      .filter(k => typeof newObject[k] === "object")
      .forEach(k => newObject[k] = deepClone(newObject[k]));
    return newObject;
  },

  isInteger: function(value) {
    return Number.isInteger(value)
  }
}