var cfg = require('../../utils/cfg.js')
var app = getApp()
Page({
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: app.language('validator.agreetitle')
    });
    this.setLang();
  },
  setLang() {
    const set = wx.T._
    this.setData({
      oauth_login: set('agreement'),
    })
  },
})