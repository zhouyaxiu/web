var app = getApp();
Page({
  data: {
    commit: [
      {
        code: 0,
        iconColor: ['rgb(0,255,255)'],
        iconType: ['success'],
        id: 19292,
        userinfo: '蓝梦',
        commit_info: app.language('commit.submitsuccess'),
        time: app.language('commit.result')
      },
      {
        code: 1,
        iconColor: ['rgb(0,255,255)'],
        iconType: ['warn'],
        id: 19292,
        userinfo: '蓝梦',
        commit_info: app.language('commit.fail'),
        time: app.language('commit.failagain')
      }
    ],

  },
  againTap: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.taskid
    })
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
  setLang(){
    const set=wx.T._
    this.setData({
      commit:set('commit'),
    })
  },
})