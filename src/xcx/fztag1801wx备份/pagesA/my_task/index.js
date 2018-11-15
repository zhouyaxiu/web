var cfg = require("../../utils/cfg.js");
var app = getApp()
var that;
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
  viewProject:function(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../task_revises/index?taskid=' + id,
    })
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
