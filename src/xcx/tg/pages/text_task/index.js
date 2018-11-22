var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    questions: {},
    id: 0,
    translate: "",
    focus: false
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "文本任务"
    });
    var that = this;
    wx.request({
      url: api.getProject() + "/" + options.id + api.getTask(),
      data: {},
      method: "get",
      header: {
        "Content-Type": "application/json;charset=utf-8",
        Cookie: app.getSid()
      },
      success: function(res) {
        that.setData({
          questions: res.data.questions
        });
      }
    });
  },
  bindTextCon: function(e) {
    this.setData({
      focus: true
    });
  },
  bindFormSubmit: function(e) {
    if (e.detail.value.translate !== "") {
      wx.showModal({
        content: "保存成功",
        showCancel: false,
        success: function(res) {
          wx.switchTab({
            url: "../index/index",
            success: function() {}
          });
        }
      });
    } else {
      wx.showModal({
        content: "请输入内容",
        showCancel: false
      });
    }
  }
});