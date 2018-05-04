let Product = new wx.BaaS.TableObject('product')
let MyContentGroup = new wx.BaaS.ContentGroup(1521091635250470)
let MyUser = new wx.BaaS.User()

Page({
  data: {
    userInfo: {},
    imageBase64: '',
  },

  showSuccessToast: function() {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  },

  showFailToast: function() {
    wx.showToast({
      title: '失败',
      icon: 'success',
      duration: 1000
    })
  },

  login: function() {
    wx.BaaS.login().then((res) => {
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      })
      console.log('res', res)
      this.showSuccessToast()
    }).catch(err => {
      console.log(err)
      this.showFailToast()
    })
  },

  logout: function() {
    wx.BaaS.logout().then(() => {
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      })
      this.showSuccessToast()
    }, err => {
      this.showFailToast()
    })
  },

  pay: function() {
    let _this = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          let params = {
            totalCost: 0.1,
            merchandiseDescription: '深蓝色秋裤'
          }
          wx.BaaS.pay(params).then(res => {
            console.log('res', res)
            _this.showSuccessToast()
          }, err => {
            console.log(err)
            _this.showFailToast()
          })
        } else {
          wx.BaaS.login()
          wx.showToast({
            title: '再来一次',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  getRecord: function() {
    Product.expand('created_by').select(['desc', 'created_by']).get('5a2fa9b008443e59e0e67829').then(res => {
      console.log('res', res.data)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  queryRecord: function() {
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', 100)
    Product.setQuery(query).find().then(res => {
      console.log('res', res.data)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  updateRecord: function() {
    Product.getWithoutData('5aa8f35b09a8050ae1bbce03').set({created_by: 100}).update().then(res => {
      console.log('res', res.data)
      this.showSuccessToast()
    }, err => {
      console.log('err', err)
      this.showFailToast()
    })
  },

  geojson: function() {
    let point = new wx.BaaS.GeoPoint(20, 20)
    let product = Product.create()
    product.set('gjson', point).save().then(res => {
      console.log('res', res)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  getContent: function() {
    MyContentGroup.getContent(1521091701839706).then(res => {
      console.log('res', res)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  getUser: function() {
    MyUser.get(61718290).then(res => {
      console.log('res', res)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  uploadFile: function() {
    let _this = this
    wx.chooseImage({
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = {filePath: res.tempFilePaths[0]}
        let metaData = {categoryName: 'SDK'}

        MyFile.upload(fileParams, metaData).then(res => {
          let data = res.data
          console.log('res', data)
          _this.showSuccessToast()
        }, err => {
          console.log(err)
          _this.showFailToast()
        })
      }
    })
  },

  getWXACode: function() {
    const params = {
      path: '../index/index?id=A',
      width: 250
    }
    wx.BaaS.getWXACode('wxacode', params, true, 'SDK').then(res => {
      this.setData({ imageBase64: res.image })
    }).catch(err => {
      console.log(err)
    })
  },

  getRunData: function() {
    wx.getWeRunData({
      success(res) {
        console.log('encrypted data:', res.encryptedData)
        wx.checkSession({
          success: function () {
            wx.BaaS.wxDecryptData(res.encryptedData, res.iv, 'we-run-data').then(decrytedData => {
              console.log('decryted data', decrytedData)
              wx.showModal({ title: '微信步数', content: '控制台查看' })
            }, err => {
              showFailToast()
              console.log(err)
            })
          },
          fail: function () {
            wx.BaaS.logout()
            wx.BaaS.login()
          }
        })
      }
    })
  },

  reportTicket: function() {
    wx.BaaS.wxReportTicket('ddd').then(res => {
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  invokeFunction: function() {
    wx.BaaS.invokeFunction('helloWorld', undefined).then(res => {
      if (res.code === 0) {
        // success
        console.log(res.data)
      } else {
        // faile
        console.log(res.error.message)
      }
    }, err => {
      console.log('err', err)
    })
  },

  tempTest: function() {
    let product = Product.create()
    product.set('categoryID', 200).save().then(res => {
      this.showSuccessToast()
    }, err => {
      this.showFailToast()
      console.log(err)
    })
  }
})