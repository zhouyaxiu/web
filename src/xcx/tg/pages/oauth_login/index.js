var api = require("../../utils/api.js");
var cfg = require("../../utils/cfg.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: cfg.getAPIURL() + '/api/oauth/login/xiaochengxu',
            data: {
              code: res.code,
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function(response) {
              if (response.data.code === 0) {
                app.setSid(response.data.data)
                app.setCookie(response.header["Set-Cookie"])
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else if (response.data.code === 1) {
                app.setCookie(response.header["Set-Cookie"])
                wx.navigateTo({
                  url: '/pages/oauth_register/index'
                })
              } else {
                wx.showToast({
                  title: response.errMsg,
                })
              }
            },
            fail: function(response) {
              console.log(response)
              wx.showToast({
                title: response.errMsg,
              })
            }
          })
        } else {
          wx.showToast({
            title: res.errMsg,
          })
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function () {
        console.log('fail-login');
        wx.showToast({
          title: '微信授权失败',
        })
      }
    })
  }
});