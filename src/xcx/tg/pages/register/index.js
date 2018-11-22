var api = require("../../utils/api.js");
var md5 = require("../../utils/md5.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    logo: "../../images/logo.png",
    username: "",
    email: "",
    mobile: "",
    code: "",
    password: "",
    password2: "",
    getSmsCode: "",
    getSmsCodeBtnColor: "#15b3e4",
    isactive: true,
    smsCodeDisabled: false,
    agree: app.language('register.isagree'),
    isagree: "",
    checked: true
  },
  onLoad: function () {
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        this.setData({
          langIndex: res.data
        })
      }
    });
    wx.setNavigationBarTitle({
      title: app.language('validator.registertitle')
    });
    this.setLang()
    this.setData({
      getSmsCode:app.language('register.getSmsCode')
    })
  },
  setLang() {
    const set = wx.T._
    this.setData({
      register: set('register'),
    })
  },
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindEmailInput: function (e) {
    this.setData({
      email: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  bindPassword2Input: function (e) {
    this.setData({
      password2: e.detail.value
    });
  },
  bindRemberInput: function (e) {
    this.setData({
      agree: e.detail.value
    });
  },
  checkMobile: function () {
    var mobile = this.data.mobile;
    var code = this.data.code;
    var that = this;
    var count = 60;
    if (this.data.mobile == "") {
      // todo  验证是否符合格式 最简单:11位数字
      wx.showToast({
        title: app.language('validator.notnull'),
        icon: 'none',
        duration: 1000
      });
    } else if (!util.isTel(this.data.mobile)) {
      wx.showToast({
        title: app.language('validator.formaterror'),
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.request({
        url: "https://www.fanhantech.com/api/account/mobile?countryCode=86&mobile=" + mobile,
        method: "get",
        header: {
          "content-type": "application/json"
        },
        data: {
          CountryCode: "86",
          Mobile: mobile,
        },
        success: function (res) {
          if (res.data === true) {
            wx.showToast({
              title: app.language('validator.exist'),
              icon: 'none',
              duration: 1000
            });
          } else {
            wx.request({
              url: api.getSmsverificationcode(),
              method: "post",
              header: {
                "content-type": "application/json"
              },
              data: {
                CountryCode: "86",
                Mobile: mobile
              },
              success: function (res) {
                if (res.data.code === 0) {
                  wx.showToast({
                    title: app.language('validator.sendcode'),
                    icon: 'none',
                    duration: 1000
                  });
                  var si = setInterval(function () {
                    if (count > 0) {
                      count--;
                      that.setData({
                        getSmsCode: count + " s",
                        getSmsCodeBtnColor: "#dedede",
                        isactive: false,
                        smsCodeDisabled: true
                      });
                    } else {
                      that.setData({
                        getSmsCode: app.language('validator.getcode'),
                        getSmsCodeBtnColor: "#15b3e4",
                        isactive: true,
                        smsCodeDisabled: false
                      });
                      count = 60;
                      clearInterval(si);
                    }
                  }, 1000);
                } else {
                  wx.showToast({
                    title: app.language('validator.errorphone'),
                    icon: 'none',
                    duration: 1000
                  });
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: app.language('validator.networkerror'),
                  icon: "none",
                  duration: 1500
                });
              },
              complete: function () { }
            });
          }
        },
        fail: function () {
          wx.showToast({
            title: app.language('validator.networkerror'),
            icon: "none",
            duration: 2000
          });
        }
      });
    }
  },

  register: function () {
    var username = this.data.username;
    var email = this.data.email;
    var mobile = this.data.mobile;
    var code = this.data.code;
    var password = this.data.password;
    var password2 = this.data.password2;
    var rember = this.data.rember;
    if (this.data.username == "") {
      wx.showToast({
        title: app.language('validator.username'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.email === '') {
      wx.showToast({
        title: app.language('validator.email'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.mobile === '') {
      wx.showToast({
        title: app.language('validator.phone'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.code === '') {
      wx.showToast({
        title: app.language('validator.code'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.password === '') {
      wx.showToast({
        title: app.language('validator.passwordnonull'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.password.length < 6 || this.data.password.length > 20) {
      wx.showToast({
        title: app.language('validator.middle'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.password2 !== this.data.password) {
      wx.showToast({
        title: app.language('validator.differ'),
        icon: 'none',
        duration: 1000
      });
    } else if (this.data.agree.length===0) {
      wx.showToast({
        title: app.language('validator.check'),
        icon: 'none',
        duration: 1000
      });
    } else {
      var that = this;
      wx.request({
        url: api.getResgister(),
        data: {
          Username: username,
          CountryCode: "86", // todo 目前只支持86
          Mobile: mobile,
          Code: code,
          Password: md5(password), /// md5()
          Confirm: md5(password2),
          Email: email,
          Agree: true
        },
        method: "post",
        header: {
          "content-type": "application/json"
        },
        success: function (res) {
          if (res.data.code === 0) {
            wx.showToast({
              title: app.language('validator.loginsuccess'),
              icon: "success",
              duration: 1000
            });
            setTimeout(function () {
              wx.navigateTo({
                url: "../login/index"
              });
            }, 2000);
          } else {
            wx.showToast({
              title: app.language('validator.wrong'),
              icon: "none",
              duration: 2000
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: app.language('validator.networkerror'),
            icon: "none",
            duration: 2000
          });
        },
        complete: function () { }
      });
    }
  }
});