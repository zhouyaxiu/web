var cfg = require("../../utils/cfg.js");
var wxRequest = require("../../utils/wxRequest.js");
var app = getApp();
Page({
  data: {
    url: 'https://www.fanhantech.com/login',
    user: {},
    integral: '',
    exchange:true
  },
  setLang() {
    const set = wx.T._
    this.setData({
      usermoney: set('usermoney'),
    })
  },
  onLoad() {
    // var url=cfg.getAPIURL() + '/api/user/current';
    // var header=app.globalData.header;
    // return wxRequest.getRequest(url,header)
    // .then(response=>{
    //   this.setData({
    //     user: response.data.data
    //   });
    //   var url=cfg.getAPIURL() + '/api/user/balance';
    //   return wxRequest.getRequest(url,header);
    // })
    // .then(response=>{
    //   if (response.data.code === 0) {
    //     if (response.data.data.applying) {
    //       this.setData({
    //         exchange: false
    //       })
    //     }
    //     this.setData({
    //       integral: response.data.data.balance
    //     })
    //   }
    // })
    cfg.wxPromise(wx.request)({
      url:cfg.getAPIURL() + '/api/user/current',
      header : app.globalData.header,
    })
    .then(res=>{
      this.setData({
        user: res.data.data
      });
    })
    cfg.wxPromise(wx.request)({
      url:cfg.getAPIURL() + '/api/user/balance',
      header : app.globalData.header,
    })
    .then(res=>{
      if (res.data.code === 0) {
        if (res.data.data.applying) {
          that.setData({
            exchange: false
          })
        }
        this.setData({
          integral: res.data.data.balance
        })
      }
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: app.language('validator.usertitle')
    });
    this.setLang();
    // var wxGetSystemInfo=wxRequest.wxGetSystemInfo()
    // return wxGetSystemInfo()
    // .then(response=>{
    //   this.setData({
    //     screenHeight: response.windowHeight / 2.618 + "px",
    //   })
    // })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.windowHeight / 2.618 + "px",
        })
      }
    })
  },
  exchange: function () {
    cfg.wxPromise(wx.request)({
      url:cfg.getAPIURL() + '/api/user/balance',
      header : app.globalData.header,
    })
    .then(res=>{
      if (res.data.code === 0) {
        if (res.data.data.balance === 0) {
          cfg.titleToast(app.language('validator.nointergral'))
        } else {
          wx.navigateTo({
            url: '../../pagesA/widthdraw_cash/index'
          })
        }
      } else {
        cfg.titleToast(res.data.message)
      }
    })
  }
})