const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const Promise = require('./promise')
const request = require('./request')
const storage = require('./storage')
const utils = require('./utils')

const API = BaaS._config.API

let isLogining = false
let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

// 获取登录凭证 code, 进而换取用户登录态信息
const auth = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        return sessionInit(res.code, resolve, reject)
      },
      fail: () => {
        utils.wxRequestFail(reject)
      },
    })
  })
}

// code 换取 session_key，生成并获取 3rd_session 即 token
const sessionInit = (code, resolve, reject) => {
  return request({
    url: API.LOGIN,
    method: 'POST',
    data: {
      code: code
    }
  }).then(res => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      resolve(res)
    } else {
      reject(new HError(res.statusCode, utils.extractErrorMsg(res)))
    }
  }, err => {
    reject(err)
  })
}

const login = (userInfo = true) => {
  if (userInfo) {
    if (storage.get(constants.STORAGE_KEY.USERINFO)) {
      return new Promise(resolve => {
        resolve(makeLoginResponseData())
      })
    }

    if (isLogining) {
      return new Promise((resolve, reject) => {
        loginResolve.push(resolve)
        loginReject.push(reject)
      })
    }

    isLogining = true

    return new Promise((resolve, reject) => {
      loginResolve.push(resolve)
      loginReject.push(reject)
      silentLogin().then(() => {
        return getUserInfo().then(() => {
          isLogining = false
          resolveLoginCallBacks()
        })
      }).catch(err => {
        handleLoginFailure()
        rejectLoginCallBacks(true, err)
      })
    })
  } else {
    return silentLogin()
  }
}

const silentLogin = () => {
  if (storage.get(constants.STORAGE_KEY.UID)) {
    return new Promise(resolve => {
      resolve(makeLoginResponseData(false))
    })
  }

  if (isSilentLogining) {
    return new Promise((resolve, reject) => {
      silentLoginResolve.push(resolve)
      silentLoginReject.push(reject)
    })
  }

  isSilentLogining = true

  return new Promise((resolve, reject) => {
    silentLoginResolve.push(resolve)
    silentLoginReject.push(reject)
    auth().then(() => {
      isSilentLogining = false
      resolveLoginCallBacks(false)
    }, err => {
      isSilentLogining = false
      rejectLoginCallBacks(false, err)
    })
  })
}

const makeLoginResponseData = (userInfo = true) => {
  if (userInfo) return storage.get(constants.STORAGE_KEY.USERINFO)
  return {
    id: storage.get(constants.STORAGE_KEY.UID),
    openid: storage.get(constants.STORAGE_KEY.OPENID),
    unionid: storage.get(constants.STORAGE_KEY.UNIONID)
  }
}

const resolveLoginCallBacks = (userInfo = true) => {
  setTimeout(() => {
    if (userInfo) {
      while (loginResolve.length) {
        loginResolve.shift()(makeLoginResponseData())
      }
    } else {
      while (silentLoginResolve.length) {
        silentLoginResolve.shift()(makeLoginResponseData(false))
      }
    }
  }, 0)
}

const rejectLoginCallBacks = (userInfo = true, err) => {
  setTimeout(() => {
    if (userInfo) {
      while (loginReject.length) {
        loginReject.shift()(err)
      }
    } else {
      while (silentLoginReject.length) {
        silentLoginReject.shift()(err)
      }
    }
  }, 0)
}

const handleLoginFailure = (userInfo = true) => {
  if (userInfo) {
    isLogining = false
  } else {
    isSilentLogining = false
  }
}

const logout = () => {
  return new Promise((resolve, reject) => {
    // API.LOGOUT 接口不做 token 检查
    request({ url: API.LOGOUT, method: 'POST' }).then(() => {
      BaaS.clearSession()
      resolve()
    }, err => {
      reject(err)
    })
  })
}

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        let payload = {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
        let userInfo = res.userInfo
        userInfo.id = storage.get(constants.STORAGE_KEY.UID)
        userInfo.openid = storage.get(constants.STORAGE_KEY.OPENID)
        userInfo.unionid = storage.get(constants.STORAGE_KEY.UNIONID)
        return getSensitiveData(payload, resolve, reject, userInfo)
      },
      fail: () => {
        reject(makeLoginResponseData(false))
      },
    })
  })
}

// 上传 signature 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
const getSensitiveData = (data, resolve, reject, userInfo) => {
  return request({
    url: API.AUTHENTICATE,
    method: 'POST',
    data: data
  }).then((res) => {
    storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '1')
    if (!userInfo.unionid && res.data.unionid) {
      userInfo.unionid = res.data.unionid
      storage.set(constants.STORAGE_KEY.UNIONID, userInfo.unionid)
    }
    storage.set(constants.STORAGE_KEY.USERINFO, userInfo)
    resolve(res)
  }, (err) => {
    reject(err)
  })
}

module.exports = {
  auth,
  login,
  silentLogin,
  logout,
}
