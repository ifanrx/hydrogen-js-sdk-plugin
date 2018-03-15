App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('myPlugin')
    // wx.BaaS.wxExtend({
    //   wxLogin: wx.login,
    //   wxGetUserInfo: wx.getUserInfo,
    //   wxPaymentRequest: wx.requestPayment,
    // })
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    wx.BaaS.init('733b59d1b10ff4a37390')
  }
})