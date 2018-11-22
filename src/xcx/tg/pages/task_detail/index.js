var cfg = require('../../utils/cfg.js')
var app = getApp()

Page({
  data: {
    project: {},
    active:true,
    taskid: "",
    display:'none',
    clickview:false
  },
  onLoad: function (options) {
    this.data.taskid = options.taskid
    this.getProjectsInfo();
    // this.applyTask();
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
  onUnload: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  mySubmission:function(){
    if(this.data.tuflag>0){
      wx.navigateTo({
        url: '../my_submission/index?'+ 'taskid='+this.data.taskid+'&username='+this.data.username,
      })
    }else{
      wx.showToast({
        title: app.language('validator.insufficient'),
        icon: 'none',
        duration: 1000
      });
    }
  },
  // 开始任务
  startbutton: function () {
    // 需要根据taskid来跳转到不同的页面
    if(this.data.tuflag>0){
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
      }  else if (this.data.project.sopType === "TEXTWHOLE") {
        wx.navigateTo({
          url: '../text_10qc/index?taskid=' + this.data.taskid,
        })
      }  else if (this.data.project.sopType === "COLLECTCOM") {
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
    }else{
      wx.showToast({
        title: app.language('validator.taskacqfailed'),
        icon: 'none',
        duration: 1000
      });
    }
  },
  // 获取任务详情
  getProjectsInfo: function () {
    var that = this
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid,
      method: "get",
      header: app.globalData.header,
      success: function(response) {
        if (response.data === false) {
          wx.showToast({
            title: app.language('validator.failapply'),
            icon: 'none',
            duration: 1000
          });
        } else {
          that.setData({
            project: response.data.project
          });
          that.data.username=response.data.project.username
          that.data.tuflag=response.data.project.tuflag
          if(response.data.project.tuflag<=0){
            that.setData({
              active:false
            })
          }
          if(response.data.project.typeStr!==''){
            that.data.ruleSrc=response.data.project.taskProfile.ruleSrc
          }
          if(that.data.project.hasOwnProperty('taskProfile') && that.data.project.taskProfile !==''){
            that.setData({
              clickview:true
            });
            if(that.data.project.taskProfile.hasOwnProperty('taskProfile')){
              that.setData({
                'project.description':response.data.project.taskProfile.desc,
              });
            }else{
              that.setData({
                'project.description': response.data.project.description
              });
            }
          }else{
            that.setData({
              'project.description': response.data.project.description
            });
          }
        }
      },
      fail: function(response) {
        wx.showToast({
          title: app.language('validator.failget'),
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  bindRead:function(){
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        });
        if(res.platform==='android'){
          wx.downloadFile({
            url: that.data.ruleSrc,
            success: function(res) {
              const filePath = res.tempFilePath
              wx.openDocument({
                filePath: filePath,
                success: function(res) {
                  console.log(res)
                }
              })
            }
          })
        }else{
          that.setData({
            display:'block'
          })
        }
      }
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