'use strict'
const extend = require('node.extend')
const HError = require('./HError')

let config
try {
  config = require('sdk-config')
} catch (e) {
  config = require('./config.dev')
}

/**
 * 获取 SDK 配置信息
 * @return {Object}
 */
const getConfig = () => {
  return config
}

/**
 * 获取系统 Platform 信息
 * @return {String}
 */
const getSysPlatform = () => {
  let platform = 'UNKNOWN'
  try {
    let res = wx.getSystemInfoSync()
    platform = res.platform
  } catch (e) {
    // pass for now
  }
  return platform
}

/**
 * 日志记录
 * @param  {String} msg 日志信息
 */
const log = (msg) => {
  if (typeof BaaS !== 'undefined' && BaaS.test || !getConfig().DEBUG) { // 测试环境
    return
  }
  // 记录日志到日志文件
  console.log('BaaS LOG: ' + msg) // eslint-disable-line no-console
}

/**
 * 转换 API 参数
 * @param  {String} url    API URL
 * @param  {Object} params API 参数
 * @return {String}        转换参数后的 API URL
 */
const format = (url, params) => {
  params = params || {}
  for (let key in params) {
    let reg = new RegExp(':' + key, 'g')
    url = url.replace(reg, params[key])
  }
  return url.replace(/([^:])\/\//g, (m, m1) => {
    return m1 + '/'
  })
}

const getFileNameFromPath = (path) => {
  let index = path.lastIndexOf('/')
  return path.slice(index + 1)
}

/**
 * 对 RegExp 类型的变量解析出不含左右斜杠和 flag 的正则字符串和 flags
 * @param  {RegExp} regExp
 * @return {Array} 包含正则字符串和 flags
 */
const parseRegExp = (regExp) => {
  let result = []
  let regExpString = regExp.toString()
  let lastIndex = regExpString.lastIndexOf('/')

  result.push(regExpString.substring(1, lastIndex))

  if (lastIndex !== regExpString.length - 1) {
    result.push(regExpString.substring(lastIndex + 1))
  }

  return result
}

/**
 * 将查询参数 (?categoryID=xxx) 替换为服务端可接受的格式 (?category_id=xxx) eg. categoryID => category_id
 */
const replaceQueryParams = (params = {}) => {
  let requestParamsMap = config.REQUEST_PARAMS_MAP
  let copiedParams = extend({}, params)

  Object.keys(params).map(key => {
    Object.keys(requestParamsMap).map(mapKey => {
      if (key.startsWith(mapKey)) {
        let newKey = key.replace(mapKey, requestParamsMap[mapKey])
        delete copiedParams[key]
        copiedParams[newKey] = params[key]
      }
    })
  })

  return copiedParams
}

const wxRequestFail = (reject) => {
  wx.getNetworkType({
    success: function(res) {
      if (res.networkType === 'none') {
        reject(new HError(600)) // 断网
      } else {
        reject(new HError(601)) // 网络超时
      }
    }
  })
}

const extractErrorMsg = (res) => {
  let errorMsg = ''
  if (res.statusCode === 404) {
    errorMsg = 'not found'
  } else if (res.data.error_msg) {
    errorMsg = res.data.error_msg
  } else if (res.data.message) {
    errorMsg = res.data.message
  }
  return errorMsg
}

module.exports = {
  log,
  format,
  getConfig,
  getSysPlatform,
  getFileNameFromPath,
  parseRegExp,
  replaceQueryParams,
  wxRequestFail,
  extractErrorMsg,
}
