var cfg = require("../../utils/cfg.js");
var app = getApp()
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
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + this.data.taskid + "/task/revises?page=" + this.data.page,
      method: "get",
      header: app.globalData.header,
      success: response=> {
        var temptasks = response.data.tasks
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
          this.setData({
            waitArray: this.data.waitArray.concat(waitArray),
            passArray: this.data.passArray.concat(passArray),
            rejectArray: this.data.rejectArray.concat(rejectArray)
          })
        }
      },
      fail: function (response) {
        cfg.titleToast(app.language('validator.taskfailture'))
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
      cfg.titleToast( app.language('validator.loadingfinish'))
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
