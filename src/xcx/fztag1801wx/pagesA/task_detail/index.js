var cfg = require('../../utils/cfg.js')
var app = getApp()
Page({
  data: {
    project: {},
    startflag: true,
    active:false,
    taskid: "",
  },
  onLoad: function (options) {
    this.data.taskid = options.taskid
    this.getProjectsInfo();
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    this.setLang()
  },
  setLang(){
    const set=wx.T._
    this.setData({
      task_detail:set('task_detail'),
    })
  },
  NavigatorTo:function(type,url){
    wx.navigateTo({
      url: '../url/index?taskid=' + this.data.taskid,
    })
  },
  // 开始任务
  startbutton: function () {
    // 需要根据taskid来跳转到不同的页面
    if (this.data.project.sopType === "COLLECTA") {
      // wx.navigateTo({
      //   url: '../recordwav/index?taskid=' + this.data.taskid,
      // })
      wx.navigateTo({
        url: '../camera1/index?taskid=' + this.data.taskid,
      })
    } else if (this.data.project.sopType === "COLLECTWAV") {
      wx.navigateTo({
        url: '../recordwav/index?taskid=' + this.data.taskid,
      })
    } else if (this.data.project.sopType === "COLLECTIMG") {
      if (this.data.project.id.startsWith("t20") === true){
        wx.navigateTo({
          url: '../camera2/index?taskid=' + this.data.taskid,
        })
      }else{
        wx.navigateTo({
          url: '../camera1/index?taskid=' + this.data.taskid,
        })
      }
    } else if (this.data.project.sopType === "TEXTWHOLE") {
      wx.navigateTo({
        url: '../text_10qc/index?taskid=' + this.data.taskid,
      })
    } else if (this.data.project.sopType === "COLLECTCOM") {
      wx.navigateTo({
        url: '../camera3/index?taskid=' + this.data.taskid,
      })
    } else {
      wx.showToast({
        title: app.language('validator.nosupport'),
        icon: 'none',
        duration: 1000
      });
    }
  },
  mySubmission:function(){
    wx.navigateTo({
      url: '../my_submission/index?'+ 'taskid='+this.data.taskid+'&username='+this.data.username,
    })
  },
  // 获取任务详情
  getProjectsInfo () {
    cfg.wxPromise(wx.request)({
      url:cfg.getAPIURL() + "/api/projects/" + this.data.taskid,
      header : app.globalData.header,
    })
    .then(response=>{
      if (response.data === false) {
        cfg.titleToast(app.language('validator.failapply'))
      } else if (response.data.project) {
        this.setData({
          project: response.data.project,
          startflag: false,
          active:true
        });
        this.data.username=response.data.project.username
      }
    })
    .catch(error=>{
      cfg.titleToast("error")
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globaldata.ShareAppTitle,
      desc: app.globaldata.ShareAppDesc,
      path: '/pages/index/index'
    }
  }
})