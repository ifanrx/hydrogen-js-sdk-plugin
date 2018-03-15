const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

class TableRecord  extends BaseRecord {
  constructor(tableID, recordID) {
    super(recordID)
    this._tableID = tableID
  }

  save() {
    let record = utils.cloneDeep(this._record)
    this._record = {}
    return BaaS.createRecord({tableID: this._tableID, data: record})
  }

  update() {
    let record = utils.cloneDeep(this._record)
    this._record = {}
    return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
  }
}

module.exports = TableRecord