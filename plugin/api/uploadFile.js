const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const HError = require('./HError')
const Promise = require('./promise')
const utils = require('./utils')

// get the upload config for upyun from sso
const getUploadFileConfig = (fileName, metaData) => {
  metaData.filename = fileName

  return baasRequest({
    url: BaaS._config.API_HOST + BaaS._config.API.UPLOAD,
    method: 'POST',
    data: metaData
  })
}

const wxUpload = (config, resolve, reject, type) => {
  return wx.uploadFile({
    url: config.uploadUrl,
    filePath: config.filePath,
    name: constants.UPLOAD.UPLOAD_FILE_KEY,
    formData: {
      authorization: config.authorization,
      policy: config.policy
    },
    header: {
      'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + BaaS.getAuthToken(),
      'X-Hydrogen-Client-Version': BaaS._config.VERSION,
      'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
      'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
      'User-Agent': constants.UPLOAD.UA,
    },
    success: (res) => {
      let result = {}
      let data = JSON.parse(res.data)

      result.status = 'ok'
      result.path = config.destLink
      result.file = {
        'id': config.id,
        'name': config.fileName,
        'created_at': data.time,
        'mime_type': data.mimetype,
        'cdn_path': data.url,
        'size': data.file_size,
      }

      delete res.data

      if (type && type === 'json') {
        res.data = result
      } else {
        res.data = JSON.stringify(result)
      }

      resolve(res)
    },
    fail: () => {
      utils.wxRequestFail(reject)
    }
  })
}

const uploadFile = (fileParams, metaData, type) => {
  if (!fileParams || typeof fileParams !== 'object' || !fileParams.filePath) {
    throw new HError(605)
  }

  if(!metaData) {
    metaData = {}
  } else if (typeof metaData !== 'object') {
    throw new HError(605)
  }

  return new Promise((resolve, reject) => {
    let fileName = utils.getFileNameFromPath(fileParams.filePath)

    return getUploadFileConfig(fileName, utils.replaceQueryParams(metaData)).then(res => {
      let config = {
        id: res.data.id,
        fileName: fileName,
        policy: res.data.policy,
        authorization: res.data.authorization,
        uploadUrl: res.data.upload_url,
        filePath: fileParams.filePath,
        destLink: res.data.file_link
      }
      return wxUpload(config, resolve, reject, type)
    })
  })
}

module.exports = uploadFile
