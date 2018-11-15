var cfg = require("utils/cfg.js");
var event = require("utils/event.js");
var en = require("utils/en.js");
var zh = require("utils/zh.js");
var T = require("utils/il8n.js");
T.T.registerLocale({  en, zh })
T.T.setLocale('zh')
wx.T = T.T
App({
  onLaunch: function () {
    // setTimeout(function(){
    //   var pages = getCurrentPages();
    //   getCurrentPages()[0].showmessage()
    //   var prevPage = pages[pages.length - 2]
    // },5000)
  },
  globalData: {
    userInfo: null,
    header: {
      "Content-Type": "application/json;charset=utf-8",
      Cookie: ""
    },
    Sid: '',
    ShareAppTitle: "泛函科技",
    ShareAppDesc: "泛函科技",
    messages: {
      en, zh
    },
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
    langs: ['中文简体', 'English'],
    langIndex: 0,
    langCode: ['zh', 'en'],
  },

  systemLanguage:function(){
    var res = wx.getSystemInfoSync()
    var lang = ''
    if (res.language === 'en') {
      lang = 'en'
    } else if(res.language==='zh-CH') {
      lang = 'zh'
    }else{
      lang = 'en'
    }
  },
  language: function (key) {
    var lang = wx.T.locale
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
  initLanguage:function(){
    var lang = wx.T.locale
    this.setTabBarLang(lang,this.globalData.jsonData)
  },
  checkLanguage: function (e) {
    let index = e.detail.value
    var lang = wx.T.locale
    if (Number(index) === 0) {
      lang = wx.T.locale = 'zh'
      this.globalData.langIndex = 0
    } else if (Number(index) === 1) {
      lang = wx.T.locale = 'en'
      this.globalData.langIndex = 1
    } else {
      lang = wx.T.locale
    }
    this.setTabBarLang(lang,this.globalData.jsonData)
    // wx.T.setLocale(this.globalData.langCode[index])

    // wx.T.setLocale(lang)
    // console.log(wx.T.setLocale('en'),'9239')
  },
  setTabBarLang: function (inx, arr) {
    var newjson = [];
    for(var key in arr){
      newjson.push(arr[key][inx])
    }
    newjson.forEach(function (element, index, arr) {
      newjson[index] = element
      wx.setTabBarItem({
        'index': index,
        'text': element
      })
    })
    return newjson
  },
  setTabBarLang_: function (inx, arr, showdata) {
    var newjson = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      newjson.push(item[inx])
    }
    newjson.forEach(function (element, index, arr) {
      showdata[index] = element
      wx.setTabBarItem({
        'index': index,
        'text': element
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
  },
});