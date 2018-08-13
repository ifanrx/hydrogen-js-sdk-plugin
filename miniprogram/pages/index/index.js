const MyPruductTable = new wx.BaaS.TableObject('product')

Page({
  onLoad: function () {
    console.log(wx.BaaS)
  },

  getRecord: function() {
    MyPruductTable.get(123).then(res => {
      console.log('product', res.data)
    })
  },

  queryRecord: function() {
    let query = new wx.BaaS.Query()
    query.compare('name', '=', 'apple')

    MyPruductTable.setQuery(query).find().then(res => {
      console.log('products', res.data)
    })
  },

  uploadFile: function() {
    wx.chooseImage({
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'SDK' }

        MyFile.upload(fileParams, metaData).then(res => {
          console.log('文件上传成功')
        })
      }
    })
  },

  wechatPay: function() {
    wx.BaaS.login(false).then(res => {
      let params = {
        totalCost: 0.1,
        merchandiseDescription: '深蓝色秋裤'
      }
      wx.BaaS.pay(params).then(res => {
        console.log('支付成功，订单号：', res.transaction_no)
      })
    })
  },

  decryptData: function() {
    wx.getWeRunData({
      success(res) {
        wx.checkSession({
          success: function () {
            wx.BaaS.wxDecryptData(res.encryptedData, res.iv, 'we-run-data')
              .then(decrytedData => {
                console.log('解密后的数据: ', decrytedData)
              })
          },
        })
      }
    })
  },

  getWxcode: function() {
    const params = {
      path: '../user/index?id=123456',
      width: 250
    }

    wx.BaaS.getWXACode('wxacode', params).then(res => {
      this.setData({ imageBase64: res.image })
    })
  },
  data: {
    veryrichAdConfig: JSON.stringify({ id: '123', show: false, other: '456' })
  }
})