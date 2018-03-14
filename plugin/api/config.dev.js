const config = require('./config')
const extend = require('../utils').extend

let devConfig = {
  DEBUG: true,
}

module.exports = extend(config, devConfig)