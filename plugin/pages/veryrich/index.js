// plugin/pages/veryrich/index.js
const API_HOST = 'https://sso.ifanr.com/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adURL: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      ad_config
    } = options
    wx.request({
      url: API_HOST + 'api/veryrich/config',
      data: {
        ad_config: ad_config
      },
      success: (res) => {
        this.setData({
          adURL: res.data.redirect_url
        })
      }
    })
  }
})