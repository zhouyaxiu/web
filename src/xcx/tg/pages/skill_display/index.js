var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var md5 = require("../../utils/md5.js");
var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 2500,
    duration: 1000,
    language: {},
    list_length: 0,
    slider: []
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "技能展示"
    });
    this.getLanguages();
  },
  getLanguages: function() {
    var that = this;
    wx.request({
      url: api.Skill(),
      data: {},
      method: "get",
      header: {
        "Content-Type": "application/json;charset=utf-8",
        Cookie: app.getSid()
      },
      success: function(res) {
        that.setData({
          language: res.data.language
        });
      }
    });
  },
  onPullDownRefresh: function() {
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 2000
    });
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {
    return {
      title: app.globaldata.ShareAppTitle,
      desc:  app.globaldata.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});