var cfg = require("../../utils/cfg.js");
var app = getApp()
var that;
let query= {
  uuid: "",
  cuser: "",
  checkres: 999999,
  time: "",
  done: 999999,
  page: 1,
  pagesize: 10,
  totalPage:1,
  begin:0,
  end:0
};
Page({
  data: {
    tasks:[]
  },
  getTasks: function () {
    var that=this
    wx.request({
      url:cfg.getAPIURL()+"/api/projects/"+ that.data.taskid + "/task/reviews",
      method: "POST",
      header: app.globalData.header,
      data:{
        uuid: query.uuid,
        username:that.data.username,
        checkuser: query.cuser,
        checkres: query.checkres,
        done: query.done,
        page: query.page,
        pagesize: query.pagesize,
        totalpage:query.totalPage,
        begin: query.begin,
        end: query.end
      },
      success: function(response){
        if(response.statusCode===200){
          that.setData({
            tasks: that.data.tasks.concat(response.data.tasks)
          });
          query.totalpage=response.data.pager.totalPage
          query.page=response.data.pager.page
          query.pagesize=response.data.pager.pageSize
        }
      },
      fail: function(response) {
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
      my_submission: set('my_submission'),
    })
  },
  onLoad: function (options) {
    this.data.taskid=options.taskid;
    this.data.username=options.username;
    query.page=1
    this.getTasks();
    wx.setNavigationBarTitle({
      title: app.language('validator.tasktitle')
    });
    var that=this
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    if (query.page < query.totalpage) {
      query.page=query.page+1
      this.getTasks()
    } else {
      wx.showToast({
        title: app.language('validator.loadingfinish'),
        icon: "none",
        duration: 1500
      });
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
