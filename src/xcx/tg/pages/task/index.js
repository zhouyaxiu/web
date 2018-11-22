//获取应用实例
var api = require('../../utils/api.js')
var app = getApp()
var that;
Page({
  data: {
    nodata: true,
    navbar: [
      '待工作', '待验收', '已完结', '其他'
    ],
    currentTab: 0, // 导航栏切换索引
    radioList: [],
    songList: [],
    topList: [],
    scrollviewH: 0, // 搜索结果的scrollview高度
    scrollFlag: true, // 上拉分页加载条件
    scrollToView: 'scrollTop', // 返回顶部位置
    backToTop: false, // 返回顶部
    projects: {},
  },
  taskTap: function(e) {
    wx.navigateTo({
      url: '../task_detail/index?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow: function() {
    this.getProjects();
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '任务'
    })
  },
  getProjects: function(res) {
    var that = this;
    wx.request({
      url: api.getProjects(),
      data: {},
      method: 'get',
      header: app.globalData.header,
      success: function(res) {
        that.setData({
          projects: res.data.projects,
        });
      }
    });
  },
  onShareAppMessage: function() {
    return {
      title: app.globaldata.ShareAppTitle,
      desc: app.globaldata.ShareAppDesc,
      path: '/pages/index/index'
    }
  }
});