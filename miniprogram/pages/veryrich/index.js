// pages/veryrich/index.js
Page({
  onLoad: function(opt) {
    let {
      ad_config
    } = opt
    wx.redirectTo({
      url: `plugin://myPlugin/veryrich?ad_config=${ad_config}`,
    })
  },
})