const regeneratorRuntime = require('../../utils/regenerator');
var cfg = require("../../utils/cfg.js");
var md5 = require("../../utils/md5.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    username: "",
    password: "",
    lang: ['中文简体', 'English'],
    language: '',
    username: '',
    login: '',
    password: '',
    register: '',
    langIndex: 0,
    langCode: ['zh', 'en'],
    showData: [],
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
  },
  onLoad: function () {
    // app.checkLogin();
    this.setLang();
    wx.setNavigationBarTitle({
      title: app.language('validator.logintitle')
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
      success: res => {
      }
    })
  },
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  login: function () {
    var username = this.data.username;
    var password = this.data.password;
    // var username = "seapub";
    // var password = "wangyan"; // seapub_todo
    login(username, password)
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
      success: res => {
      }
    })
    wx.setStorage({
      key: "changelang",
      data: this.data.showData,
      success: res => {
      }
    })
    var arr = this.data.langCode[this.data.langIndex];
    app.setTabBarLang(arr, this.data.jsonData, this.data.showData);
  },
  setLang() {
    const set = wx.T._
    this.setData({
      login: set('login')
    })
    wx.setNavigationBarTitle({
      title: app.language('validator.logintitle')
    });

  }
});

async function login(username, password) {
  if (username == "" || password == "") {
    wx.showToast({
      title: app.language('validator.title'),
      icon: "none",
      duration: 1500
    });
    return
  }

  var url = cfg.getAPIURL() + "/login"
  var data = {
    username: username,
    password: md5(password)
  }
  var method = "post"
  var result = await util.request(method, url, data);

  // console.log(result)
  if (result.data.res === undefined || result.data.res === "") {
    wx.showToast({
      title: app.language('validator.title'),
      icon: "none",
      duration: 1500
    });
  } else {
    app.setSid(result.data.res); // session id
    wx.showToast({
      title: app.language('validator.success'),
      icon: "success",
      duration: 10
    });
    setTimeout(function () {
      wx.switchTab({
        url: "../index/index"
      });
    }, 10);
  }
}