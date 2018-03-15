App({
  onLaunch: function () {
    wx.BaaS = requirePlugin("myPlugin")
    wx.BaaS.init('733b59d1b10ff4a37390')
    wx.BaaS.extendFunc(wx.login, wx.getUserInfo, wx.requestPayment)
  }
})