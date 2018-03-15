Page({
  login: function() {
    wx.BaaS.login(wx.login, wx.getUserInfo)
  },

  pay: function() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          let params = {
            totalCost: 0.1,
            merchandiseDescription: '深蓝色秋裤'
          }
          wx.BaaS.pay(params).then(res => {
            console.log(res)
          }, err => {
            console.log(err)
          })
        } else {
          wx.BaaS.login()
        }
      }
    })
  },

  getRecord: function() {
    var Product = new wx.BaaS.TableObject('product')
    Product.get('5aa8f35b09a8050ae1bbce03').then(res => {
      console.log('res', res.data)
    }, err => {
      console.log('err', err)
    })
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
  }
})