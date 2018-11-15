var app = getApp();
Page({
  data: {
    func: app.language('setting.record')
  },
  // onLaunch:function(){
  //   wx.navigateTo({
  //     url: '../real_name/index'
  //   })
  // },
  bind:function(){
    wx.navigateBack({
      delta:1
    })
  },
  onLoad: function(options) {
    console.log(options)
    wx.getStorage({
      key: 'function',
      success: res => {
        if (res.data === "camera") {
          this.setData({
            func: app.language('setting.camera')
          })
        }
      }
    })
    wx.setNavigationBarTitle({
      title: app.language('validator.settingtitle')
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
    this.setLang()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      setting: set('setting')
    })
  },
  hanlder: function(e) {
    console.log(e)
    if (e.detail.authSetting["scope.record"]) {
      wx.navigateBack({
        delta: 1
      })
    }
    if (e.detail.authSetting["scope.camera"]) {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})