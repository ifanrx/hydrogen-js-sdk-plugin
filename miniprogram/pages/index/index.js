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
      console.log('res', res)
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      })
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
            console.log(res)
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
    Product.get('5aa8f35b09a8050ae1bbce03').then(res => {
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
      console.log(res.data)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
  },

  updateRecord: function() {
    Product.getWithoutData('5aa8f35b09a8050ae1bbce03').set({created_by: 100}).update().then(res => {
      console.log('res', res.data)
    }, err => {
      console.log('err', err)
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
      howFailToast()
    })
  },

  getContent: function() {
    MyContentGroup.getContent(1521091701839706).then(res => {
      this.showSuccessToast()
      console.log(res)
    }, err => {
      console.log(err)
      showFailToast()
    })
  },

  getUser: function() {
    MyUser.get(61718290).then(res => {
      console.log(res)
      this.showSuccessToast()
    }, err => {
      console.log(err)
      this.showFailToast()
    })
    // MyUser.find().then(res => {
    //   console.log('res', res)
    //   this.showSuccessToast()
    // }, err => {
    //   console.log(err)
    //   this.showFailToast()
    // })
  },

  uploadFile: function() {
    wx.chooseImage({
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'SDK' }

        MyFile.upload(fileParams, metaData).then(res => {
          let data = res.data
          console.log(data)
        }, err => {

        })
      }
    })
  },

  getWXACode: function() {
    const params = {
      path: '../index/index?id=A',
      width: 250
    }
    wx.BaaS.getWXACode('wxacode', params).then(res => {
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
  }
})