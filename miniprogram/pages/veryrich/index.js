// pages/veryrich/index.js
Page({
  onLoad: function(opt) {
    let qs = Object.keys(opt).reduce((prev , cur, i) => {
      if(i > 0) prev += '&'
       return prev + `${cur}=${encodeURIComponent(opt[cur])}`
    }, '?')
    wx.redirectTo({
      url: `plugin://myPlugin/veryrich${qs}`,
    })
  },
})