var app = getApp();
Page({
  data: {
    func: app.language('setting.record')
  },
  onLoad: function(options) {
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
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        this.setData({
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