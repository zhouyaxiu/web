var cfg = require("../../utils/cfg.js");
var app = getApp();
Page({
  onLoad: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          cfg.wxPromise(wx.request)({
            url: cfg.getAPIURL() + '/api/oauth/login/xiaochengxu',
            header: { 'content-type': 'application/json' },
            data: {
              code: res.code,
            },
          })
            .then(response => {
              switch (response.data.code) {
                case 0:
                  app.setSid(response.data.data)
                  app.setCookie(response.header["Set-Cookie"])
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                  break;
                case 1:
                  app.setCookie(response.header["Set-Cookie"])
                  wx.navigateTo({
                    url: '/pages/oauth_register/index'
                  })
                default:
                  cfg.titleToast(response.errMsg)
              }
            })
        } else {
          cfg.titleToast(response.errMsg)
        }
      }
    })
  },
});