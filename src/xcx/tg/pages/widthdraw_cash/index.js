var cfg = require("../../utils/cfg.js");
var app = getApp();
Page({
  data:{
    money:''
  },
  onLoad: function () {
    var that=this
    wx.setNavigationBarTitle({
      title: app.language('validator.widthdrawcashtitle')
    });
    wx.getStorage({
      key: 'langIndex',
      success: function(res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang();
    wx.getStorage({
      key: 'integral',
      success: function(res) {
        that.setData({
          integral: res.data
        })
      }
    });
  },
  setLang() {
    const set = wx.T._
    this.setData({
      widthdraw_cash: set('widthdraw_cash'),
    })
  },
  bindIntegralName:function(e){
    this.setData({
      points:e.detail.value,
      money:(e.detail.value)/100
    });
    console.log(e.detail.value)
    console.log(this.data.integral)
    if(this.data.integral<e.detail.value){
      this.setData({
        points:this.data.integral,
        money:(this.data.integral)/100
      });
    }
  },
  realnme_auth: function (e) {
    var integralreg = /^[1-9]+[0-9]*]*$/;
    if (e.detail.value.alipayname === '') {
      wx.showToast({
        title: app.language('validator.alipaynamenot'),
        icon: "none",
        duration: 1000
      });
    } else if (e.detail.value.alipayaccount === '') {
      wx.showToast({
        title: app.language('validator.alipayaccountnot'),
        icon: "none",
        duration: 1000
      });
    } else if (e.detail.value.points === '') {
      wx.showToast({
        title: app.language('validator.integralnot'),
        icon: "none",
        duration: 1000
      });
    } else if (this.data.integral < e.detail.value.points) {
      wx.showToast({
        title: app.language('validator.integralnotenough'),
        icon: "none",
        duration: 1000
      });
    } else if (!integralreg.test(e.detail.value.points)) {
      wx.showToast({
        title: app.language('validator.integralnumber'),
        icon: "none",
        duration: 1000
      });
    } else if ((e.detail.value.points) % 100 !== 0) {
      if(this.data.integral<e.detail.value.points){
        this.setData({
          points:this.data.integral,
        });
        if((e.detail.value.points) % 100 !== 0){
          wx.showToast({
            title: app.language('validator.integralmultiple'),
            icon: "none",
            duration: 1000
          });
        }
        }else{
          wx.showToast({
            title: app.language('validator.integralmultiple'),
            icon: "none",
            duration: 1000
          });
        }
      } else {
      wx.request({
        url: cfg.getAPIURL() + '/api/user/balance/withdraw',
        method: 'POST',
        data:{
          account:e.detail.value.alipayaccount,
          name:e.detail.value.alipayname,
          points:Number(e.detail.value.points)
        },
        header: app.globalData.header,
        success: function(response) {
          console.log(response)
          if(response.data.code===0){
            wx.showToast({
              title:response.data.message,
              icon:'none',
              duration:1000
            });
            wx.navigateTo({
              url:'/pages/usermoney/index'
            })
          }else{
            wx.showToast({
              title:response.data.message,
              icon:'none',
              duration:1000
            })
          }
        },
        fail: function(response) {
          wx.showToast({
            title: response.data.message,
          })
        }
      })
    }
  },
});