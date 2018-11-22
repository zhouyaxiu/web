var cfg = require("../../utils/cfg.js");
var app = getApp()
var that;
Page({
  data: {
    taskid: '',
    navbar: [app.language('taskrevises.beaudited'), app.language('taskrevises.pass'), app.language('taskrevises.nopass')],
    currentTab: 0, // 导航栏切换索引,
    page: 1,
    pageSize: 10,
    totalPage: 1,
    review: app.language('taskrevises.beaudited'),
    waitArray:[],
    passArray:[],
    rejectArray:[]
  },
  getTasks: function () {
    var that = this
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task/revises?page=" + that.data.page,
      method: "get",
      header: app.globalData.header,
      success: function (response) {
        var temptasks = response.data.tasks
        console.log(cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task/revises?page=" + that.data.page)
        if (response.statusCode === 200) {
          var waitArray = []
          var passArray = []
          var rejectArray = []
          for (var i = 0; i < temptasks.length; i++) {
            if (temptasks[i].review === '待审核') {
              waitArray.push(temptasks[i])
            }
            if (temptasks[i].review === '通过') {
              passArray.push(temptasks[i])
            }
            if (temptasks[i].review === '拒绝') {
              rejectArray.push(temptasks[i])
            }
          }
          that.setData({
            waitArray: that.data.waitArray.concat(waitArray),
            passArray: that.data.passArray.concat(passArray),
            rejectArray: that.data.rejectArray.concat(rejectArray)
          })
        }
      },
      fail: function (response) {
        wx.showToast({
          title: app.language('validator.taskfailture'),
          icon: "none",
          duration: 1500
        });
      }
    });
  },
  setLang() {
    const set = wx.T._
    this.setData({
      taskrevises: set('taskrevises'),
    })
  },
  onLoad: function (options) {
    this.data.taskid = options.taskid
    this.getTasks();
    wx.setNavigationBarTitle({
      title: options.taskid
    });
    this.setLang();
    var that = this
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setData({
      navbar: [app.language('taskrevises.beaudited'), app.language('taskrevises.pass'), app.language('taskrevises.nopass')]
    })
  },
  // 导航栏操作
  onNavbarTap: function (ev) {
    this.setData({ currentTab: ev.currentTarget.dataset.index });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    if (this.data.page <= this.data.totalPage) {
      var page = this.data.page + 1
      this.setData({
        page: page
      })
      this.getTasks()
    } else {
      wx.showToast({
        title: app.language('validator.loadingfinish'),
        icon: "none",
        duration: 1500
      });
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc: app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
