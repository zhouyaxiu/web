var api = require("./utils/api.js");
var cfg = require("utils/cfg.js");
var en = require("utils/en.js");
var zh = require("utils/zh.js");
var T = require("utils/il8n.js");
T.T.registerLocale({ en, zh })
T.T.setLocale('zh')
wx.T = T.T
App({
  onLaunch: function () {
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
  },
  globalData: {
    userInfo: null,
    header: {
      "Content-Type": "application/json;charset=utf-8",
      "Cookie": ""
    },
    Sid: '',
    ShareAppTitle: "泛函科技",
    ShareAppDesc: "泛函科技",
    messages: {
      en, zh
    }
  },
  language: function (key) {
    var lang = wx.T.locale;
    var keys = (lang + '.' + key).split('.')
    var tmp = this.globalData.messages
    for (const e of keys) {
      if (!tmp[e]) {
        return key
      }
      tmp = tmp[e]
    }
    return tmp
  },

  setTabBarLang: function (inx, arr, showdata) {
    var newjson = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      newjson.push(item[inx])
    }
    newjson.forEach(function (element, index, arr) {
      showdata[index] = element
      wx.setTabBarItem({
        'index': index,
        'text': element[index]
      })
    })
    return showdata
  },
  getTabbarLang: function (arr) {
    var newjson = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      newjson.push(item)
    }
    newjson.forEach(function (element, index, arr) {
      wx.setTabBarItem({
        'index': index,
        'text': element
      })
    })
  },
  setCookie: function (cookie) {
    this.globalData.header["Cookie"] = cookie;
  },
  getCookie: function () {
    return this.globalData.header["Cookie"];
  },
  setSid: function (sid) {
    this.globalData.Sid = sid;
  },
  getSid: function () {
    return this.globalData.Sid;
  }
});