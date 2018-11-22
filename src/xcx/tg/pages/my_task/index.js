var cfg = require("../../utils/cfg.js");
var app = getApp()
var that;
Page({
  data: {
    tasks:[]
  },
  getTasks: function () {
    var that=this
    wx.request({
      // url:cfg.getAPIURL()+"/api/projects",
      url:cfg.getAPIURL()+"/api/projects?username=true",
      method: "get",
      header: app.globalData.header,
      success: function(response){
        console.log(response)
        if(response.statusCode===200){
          that.setData({
            tasks: response.data.projects
          });
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
      mytask: set('mytask'),
    })
  },
  onLoad: function (options) {
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
    
    // cfg.setLang('mytask')
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
