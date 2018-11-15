var util = require("../../utils/util.js");
var countrycode = require("../../utils/country_code.js");
var cfg = require("../../utils/cfg.js");
var app = getApp();
Page({
  data: {
    logo: "../../images/logo.png",
    form: {
      username: "",
      mobile: "",
      code: "",
    },
    getSmsCode: "",
    getSmsCodeBtnColor: "#15b3e4",
    isactive: true,
    smsCodeDisabled: false,
    agree: app.language('register.isagree'),
    isagree: "",
    checked: true,
    lang: ['中文简体', 'English'],
    langIndex: 0,
    langCode: ['zh', 'en'],
    showData: [],
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
    clickcountry: false,
    countryCode: '86'
  },
  onLoad: function () {
    cfg.validate()
    wx.setNavigationBarTitle({
      title: app.language('validator.oauthregisterTitle')
    });
    this.setLang()
    this.setData({
      getSmsCode: app.language('oauth_register.getSmsCode'),
      countrycode: countrycode
    })
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
  },
  bindSelectLanguage: function (e) {
    let index = e.detail.value
    this.setData({
      langIndex: index
    });
    wx.T.setLocale(this.data.langCode[index]);
    this.onLoad()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      oauth_register: set('oauth_register')
    })
  },
  bindNameInput: function (e) {
    this.setData({
      'form.username': e.detail.value
    });
  },
  bindMobileInput: function (e) {
    this.setData({
      'form.mobile': e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      'form.code': e.detail.value
    });
  },
  bindRemberInput: function (e) {
    this.setData({
      agree: e.detail.value
    });
  },
  countrycode: function (e) {
    this.setData({
      clickcountry: true
    })
  },
  choiceCountry: function (e) {
    this.setData({
      countryCode: e.detail.value,
      clickcountry: false,
    })
  },
  agree: function () {
    if (this.data.langIndex === 1) {
      wx.navigateTo({
        url: '../../pagesA/agreement/en'
      })
    } else {
      wx.navigateTo({
        url: '../../pagesA/agreement/index'
      })
    }
  },
  registerSubmit: function (e) {
    var that=this
    if (!cfg.Validate.checkForm(e.detail.value)) {
      const error = cfg.Validate.errorList[0]
      cfg.showToast(error)
      return
    }
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + '/api/account/username?username=',
      header: app.globalData.header,
      data: {
        username: e.detail.value.username
      },
    })
      .then(res => {
        if (res.data === true) {
          cfg.titleToast(app.language('validator.usernameexist'))
        } else {
          cfg.wxPromise(wx.request)({
            url: cfg.getAPIURL() + '/api/oauth/register',
            header: app.globalData.header,
            method: "POST",
            data: {
              Username: e.detail.value.username,
              CountryCode: that.data.countryCode, // todo 目前只支持86
              Mobile: e.detail.value.mobile,
              Code: e.detail.value.code,
              Agree: true
            },
          })
            .then(res => {
              if (res.data.code === 0) {
                app.setSid(res.data.data)
                cfg.titleToast(app.language('validator.loginsuccess'))
                setTimeout(function () {
                  wx.switchTab({
                    url: "../index/index"
                  });
                }, 2000);
              } else {
                cfg.titleToast(app.language('validator.wrong'))
              }
            })
        }
      })
      .catch(res => {
        cfg.titleToast(app.language('validator.networkerror'))
      })
  },
  checkMobile: function (e) {
    var that=this
    for (var i in this.data.form) {
      if (e.currentTarget.dataset.name === i) {
        var tempForm = { [i]: this.data.form.mobile }
        if (!cfg.Validate.checkForm(tempForm)) {
          for (var j in cfg.Validate.errorList) {
            if (cfg.Validate.errorList[j].param === i) {
              const error = cfg.Validate.errorList[j]
              cfg.showToast(error)
              return;
            }
          }
        }
      }
    }
    
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + '/api/account/mobile',
      header: app.globalData.header,
      data: {
        countryCode: that.data.countryCode,
        mobile: that.data.form.mobile,
      },
    })
      .then(res => {
        if (res.data === true) {
          cfg.titleToast(app.language('validator.exist'))
          return;
        } else {
          cfg.wxPromise(wx.request)({
            url: cfg.getAPIURL() + '/api/account/smsverificationcode',
            method: "POST",
            header: app.globalData.header,
            data: {
              countryCode: that.data.countryCode,
              mobile: that.data.form.mobile
            },
          })
            .then(res => {
              if (res.data.code === 0) {
                cfg.titleToast(app.language('validator.sendcode'))
                var count = 60;
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
                cfg.titleToast(app.language('validator.errorphone'))
              }
            })
        }
      })
      .catch(res => {
        cfg.titleToast(app.language('validator.networkerror'))
      })
  }
});