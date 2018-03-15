const HError = require('./HError')
const Query = require('./Query')
const utils = require('./utils')

class BaseQuery {
  constructor() {
    this._queryObject = {}
    this._limit = 20
    this._offset = 0
    this._orderBy = null
  }

  setQuery(queryObject) {
    if (queryObject instanceof Query) {
      this._queryObject = utils.cloneDeep(queryObject.queryObject)
    } else {
      throw new HError(605)
    }
    return this
  }

  limit(value) {
    if (!Number.isInteger(value)) {
      throw new HError(605)
    }
    this._limit = value
    return this
  }

  offset(value) {
    if (!Number.isInteger(value)) {
      throw new HError(605)
    }
    this._offset = value
    return this
  }

  orderBy(args) {
    if (args instanceof Array) {
      this._orderBy = args.join(',')
    } else {
      this._orderBy = args
    }
    return this
  }

  _handleAllQueryConditions() {
    let conditions = {}
    conditions.limit = this._limit
    conditions.offset = this._offset
    if (this._orderBy) {
      conditions.order_by = this._orderBy
    }
    conditions.where = JSON.stringify(this._queryObject)
    return conditions
  }
}

module.exports = BaseQuery