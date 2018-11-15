import cfg from "../../utils/cfg.js";
import WxValidate from "../../utils/wxValidate.js";
var app = getApp();
Page({
  data: {
    money: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.language('validator.widthdrawcashtitle')
    });
    this.setLang();
    this.validate()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      widthdraw_cash: set('widthdraw_cash'),
    })
  },
  bindIntegralName: function (e) {
    this.setData({
      points: e.detail.value,
      money: (e.detail.value) / 100
    });
    if (this.data.integral < e.detail.value) {
      cfg.titleToast(app.language('validator.integralnotenough'))
      this.setData({
        points: this.data.integral,
        money: (this.data.integral) / 100
      });
    }
  },
  showToast: function (error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    });
  },
  validate: function () {
    const rules = {
      alipayname: {
        required: true
      },
      alipayaccount: {
        required: true
      },
      points: {
        required: true,
        digits: true,
        // regular:/^[1-9][0-9]*0{2}$/
      },
    }
    const message = {
      alipayname: {
        required: app.language('validator.alipaynamenot'),
      },
      alipayaccount: {
        required: app.language('validator.alipayaccountnot'),
      },
      points: {
        required: app.language('validator.integralnot'),
        // regular: app.language('validator.integralmultiple')
      },
    }
    this.Validate = new WxValidate(rules, message)
  },
  realnme_auth: function (e) {
    if (!this.Validate.checkForm(e.detail.value)) {
      const error = this.Validate.errorList[0]
      this.showToast(error)
      return
    }
    let regular = /^[1-9][0-9]*0{2}$/;
    if (!regular.test(this.data.points)) {
      cfg.titleToast(app.language('validator.integralmultiple'))
      return;
    }
    this.submit(e)
  },
  submit: function (e) {
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + '/api/user/balance/withdraw',
      method: 'POST',
      header: app.globalData.header,
      data: {
        account: e.detail.value.alipayaccount,
        name: e.detail.value.alipayname,
        points: Number(e.detail.value.points)
      },
    })
      .then(response => {
        if (response.data.code === 0) {
          cfg.titleToast(response.data.message)
          wx.navigateTo({
            url: '/pages/usermoney/index'
          })
        } else {
          cfg.titleToast( response.data.message)
        }
      })
      .catch(res => {
        cfg.titleToast(app.language('validator.networkerror'))
      })
  }
});