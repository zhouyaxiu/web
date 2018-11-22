var cfg = require("../../utils/cfg.js");
var app = getApp();
Page({
  data: {
    url: 'https://www.fanhantech.com/login',
    user: {},
    integral: '',
    exchange:true,
  },
  setLang() {
    const set = wx.T._
    this.setData({
      usermoney: set('usermoney'),
    })
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: cfg.getAPIURL() + '/api/user/current',
      method: 'GET',
      header: app.globalData.header,
      success: function(response) {
        if (response.data.code === 0) {
          that.setData({
            user: response.data.data
          })
        }
      },
      fail: function(response) {
        wx.showToast({
          title: response.errMsg,
        })
      }
    });
    wx.request({
      url: cfg.getAPIURL() + '/api/user/balance',
      method: 'GET',
      header: app.globalData.header,
      success: function(response) {
        // console.log(response)
        if (response.data.code === 0) {
          if (response.data.data.applying) {
            that.setData({
              exchange: false
            })
          }
          that.setData({
            integral: response.data.data.balance
          })
        }
        wx.setStorage({
          key: 'integral',
          data: that.data.integral
        });
      },
      fail: function(response) {
        wx.showToast({
          title: response.errMsg,
        })
      }
    });
  },
  
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'langIndex',
      success: function(res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    wx.setNavigationBarTitle({
      title: app.language('validator.usertitle')
    });
    that.setLang();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.windowHeight / 2.618 + "px",
        })
      }
    })
  },
  exchange: function () {
    wx.request({
      url: cfg.getAPIURL() + '/api/user/balance',
      method: 'GET',
      header: app.globalData.header,
      success: function(response) {
        if (response.data.code === 0) {
          if (response.data.data.balance === 0) {
            wx.showToast({
              title: "还没积分，去做任务赚取积分",
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.navigateTo({
              url: '/pages/widthdraw_cash/index'
            })
          }
        } else {
          wx.showToast({
            title: response.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function(response) {
        wx.showToast({
          title: response.data.message
        })
      }
    })
  }
})