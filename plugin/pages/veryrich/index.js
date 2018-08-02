// plugin/pages/veryrich/index.js
const API_HOST = 'https://sso.ifanr.com/'
const RENDER_TYPE_RICH_TEXT = 'richtext'
const RENDER_TYPE_WEB_VIEW = 'webPage'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    renderType: '',
    webViewURL: '',
    richText: ''
  },

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
        let type = res.data.type
        this.setData({
          renderType: type
        })

        if (type === RENDER_TYPE_RICH_TEXT) {
          this.initRichTextPage(res.data.data)
        } else if (type === RENDER_TYPE_WEB_VIEW) {
          this.initWebViewPage(res.data.data)
        }
      }
    })
  },

  initRichTextPage(html) {
    this.setData({
      richText: html
    })
  },

  initWebViewPage(url) {
    this.setData({
      webViewURL: url
    })
  }
})