// plugin/pages/veryrich/index.js
const API_HOST = 'https://sso.ifanr.com/'
let wxParser = require('../../utils/wxParser/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      ad_config
    } = options
    wx.request({
      url: API_HOST + 'api/veryrich/config',
      data: {
        ad_config: ad_config
      },
      success: (res) => {
        let that = this
        let html = res.data.html
        try {
          wxParser.parse({
            bind: 'richText',
            html: html,
            target: that,
            enablePreviewImage: false,
            tapLink: (url) => {
              // do nothing
            },
          })
        } catch (e) {
          wxParser.parse({
            bind: 'richText',
            html: `<div>HTML 解析错误: ${e.message}</div>`,
            target: that,
          });
        }
      }
    })
  }
})