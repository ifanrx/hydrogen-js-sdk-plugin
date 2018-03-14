const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const HError = require('./HError')
const Promise = require('./promise')
const storage = require('./storage')

const API = BaaS._config.API


const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

const pay = (params) => {
  if (!storage.get(constants.STORAGE_KEY.USERINFO)) {
    return new Promise((resolve, reject) => {
      reject(new HError(603))
    })
  }

  let paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  return baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: 'MD5',
        paySign: data.paySign,
        success: function (res) {
          res.transaction_no = data.transaction_no
          return resolve(res)
        },
        complete: function (res) {
          // 兼容：微信 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
          if (res.errMsg == 'requestPayment:fail cancel') {
            reject(new HError(607))
          }
        },
        fail: function (err) {
          // 微信不使用状态码来区分支付取消和支付失败，这里返回自定义状态码和微信的错误信息，便于用户判断和排错
          if (err.errMsg == 'requestPayment:fail cancel') {
            reject(new HError(607))
          } else {
            reject(new HError(608, err.errMsg))
          }
        },
      })
    })
  })
}

module.exports = pay
