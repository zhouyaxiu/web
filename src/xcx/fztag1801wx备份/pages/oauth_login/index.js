var cfg = require("../../utils/cfg.js");
var config = require("../../utils/config.js");
var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
    wx.login({
      success: function(res) {
        if (res.code) {
          cfg.wxPromise(wx.request)({
            url: cfg.getAPIURL() + '/api/oauth/login/xiaochengxu',
            header:  { 'content-type': 'application/json' },
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
            .finally(()=>{
              wx.hideLoading()
            })
        } else {
          cfg.titleToast(response.errMsg)
        }
      }
    })

    // var wxLogin = config.wxLogin()
    // wxLogin().then(res => {
    //   var url = cfg.getAPIURL() + '/api/oauth/login/xiaochengxu';
    //   var data = {
    //     code: res.code,
    //   };
    //   var header = app.globalData.header;
    //   return config.getRequest(url, data, header)
    // })
    //   .then(response => {
    //     switch (response.data.code) {
    //       case 0:
    //         app.setSid(response.data.data)
    //         app.setCookie(response.header["Set-Cookie"])
    //         wx.switchTab({
    //           url: '/pages/index/index'
    //         })
    //         break;
    //       case 1:
    //         app.setCookie(response.header["Set-Cookie"])
    //         wx.navigateTo({
    //           url: '/pages/oauth_register/index'
    //         })
    //       default:
    //         cfg.titleToast(response.errMsg)
    //     }
    //   })
  },
});