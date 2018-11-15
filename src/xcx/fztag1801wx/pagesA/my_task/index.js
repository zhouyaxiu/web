var cfg = require("../../utils/cfg.js");
var app = getApp()
Page({
  data: {
  },
  setLang() {
    const set = wx.T._
    this.setData({
      mytask: set('mytask'),
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.language('validator.tasktitle')
    });
    this.setLang();
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
