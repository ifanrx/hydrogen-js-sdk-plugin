const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const _cloneDeep = require('../utils').cloneDeep

class UserRecord extends BaseRecord {
  constructor() {
    super()
  }

  update() {
    let record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.updateUser({data: record})
  }
}

module.exports = UserRecord