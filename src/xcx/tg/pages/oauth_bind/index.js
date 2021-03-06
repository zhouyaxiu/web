var api = require("../../utils/api.js");
var cfg = require("../../utils/cfg.js");
var util = require("../../utils/util.js");
var countrycode = require("../../utils/country_code.js");
var app = getApp();
Page({
  data: {
    logo: "../../images/logo.png",
    mobile: "",
    code: "",
    getSmsCode: "",
    getSmsCodeBtnColor: "#15b3e4",
    isactive: true,
    smsCodeDisabled: false,
    lang: ['中文简体', 'English'],
    langIndex: 0,
    langCode: ['zh', 'en'],
    showData: [],
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
    clickcountry: false,
    countrydata: '86'
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.language('validator.oauthbindTitle')
    });
    this.setLang()
    this.setData({
      getSmsCode: app.language('oauth_login.getSmsCode'),
      countrycode: countrycode
    })
    wx.setNavigationBarTitle({
      title: app.language('validator.oauthregisterTitle')
    });
    if (wx.T.locale === 'en') {
      this.setData({
        langIndex: 1
      })
    } else {
      this.setData({
        langIndex: 0
      })
    }
    wx.T.setLocale(this.data.langCode[this.data.langIndex]);
    var arr = this.data.langCode[this.data.langIndex];
    app.setTabBarLang(arr, this.data.jsonData, this.data.showData);
    wx.setStorage({
      key: "changelang",
      data: this.data.showData,
      success: function (res) {
      }
    })
  },
  countrycode: function (e) {
    this.setData({
      clickcountry: true
    })
  },
  choiceCountry: function (e) {
    this.setData({
      countrydata: e.detail.value,
      clickcountry: false,
    })
    console.log(this.data.countrydata)
  },
  bindSelectLanguage: function (e) {
    let index = e.detail.value
    this.setData({
      langIndex: index
    });
    wx.T.setLocale(this.data.langCode[index]);
    this.onLoad()
    wx.setStorage({
      key: "langIndex",
      data: this.data.langIndex,
      success: function (res) {
      }
    })
    wx.setStorage({
      key: "changelang",
      data: this.data.showData,
      success: function (res) {
      }
    })
    var arr = this.data.langCode[this.data.langIndex];
    app.setTabBarLang(arr, this.data.jsonData, this.data.showData);
  },
  setLang() {
    const set = wx.T._
    this.setData({
      oauth_login: set('oauth_login'),
    })
  },
  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  checkMobile: function () {
    var mobile = this.data.mobile;
    var code = this.data.code;
    var countryCode = this.data.countrydata;
    var that = this;
    var count = 60;
    if (this.data.mobile == "") {
      // todo  验证是否符合格式 最简单:11位数字
      wx.showToast({
        title: app.language('validator.notnull'),
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.request({
        url: cfg.getAPIURL() + "/api/account/mobile",
        method: "get",
        header: app.globalData.header,
        data: {
          countryCode: countryCode,
          mobile: mobile,
        },
        success: function (res) {
          if (res.data !== true) {
            wx.showToast({
              title: app.language('validator.notexist'),
              icon: 'none',
              duration: 1000
            });
          } else {
            wx.request({
              url: cfg.getAPIURL() + '/api/account/smsverificationcode',
              method: "post",
              header: app.globalData.header,
              data: {
                countryCode: countryCode,
                mobile: mobile
              },
              success: function (res) {
                console.log(res)
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
    var mobile = this.data.mobile;
    var countryCode = this.data.countrydata;
    var code = this.data.code;
    if (this.data.mobile === '') {
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
    } else {
      var that = this;
      wx.request({
        url: cfg.getAPIURL() + '/api/oauth/bind',
        data: {
          countryCode: countryCode, // todo 目前只支持86
          mobile: mobile,
          code: code
        },
        method: "POST",
        header: app.globalData.header,
        success: function (res) {
          console.log(countryCode)
          console.log(res)
          if (res.data.code === 0) {
            app.setSid(res.data.data)
            wx.showToast({
              title: app.language('validator.loginsuccess'),
              icon: "success",
              duration: 1000
            });
            setTimeout(function () {
              wx.switchTab({
                url: "../index/index"
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