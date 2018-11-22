var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2500,
    duration: 1000,
    iconColor: ["rgb(0,255,255)"],
    projects: {},
    list_length: 0,
    slider: []
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "首页"
    });
  },
  onShow: function() {
    this.getProjects();
  },
  getProjects: function() {
    var that = this
    wx.request({
      url: "https://127.0.0.1:50052/tasklistctl/getlist",  // api.getProjects(),
      data: {
        sid: app.getSid(),
      },
      method: "post",
      header: {
        "Authorization": app.getSid(),
        "Content-Type": "application/json;charset=utf-8",
      },
      success: function(res) {
        that.setData({
          projects: res.data.tasklist
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
      desc: app.globaldata.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});