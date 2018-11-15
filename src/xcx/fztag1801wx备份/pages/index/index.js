var cfg = require("../../utils/cfg.js");
var app = getApp();
var event = require("../../utils/event.js");
Page({
  data: {
    lang: ['中文简体', 'English'],
    langIndex: 0,
    langCode: ['zh', 'en'],
    showData: [],
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
    showSkeleton:false
  },
  onReady:function(){
    event.emit('sendTime',Date.now())
  },
  onLoad: function() {
		// setTimeout(() => {
		// 	this.setData({
		// 		showSkeleton: false
		// 	})
    // }, 3000)
    wx.setNavigationBarTitle({
      title: app.language('validator.indextitle')
    });
    this.setLang();
    // switch (wx.T.locale) {
    //   case "en":
    //     this.setData({
    //       langIndex: 1
    //     })
    //     break;
    //   default:
    //     this.setData({
    //       langIndex: 0
    //     })
    //     break
    // }
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
    app.setTabBarLang(wx.T.locale,this.data.jsonData)
  },
  setLang() {
    const set = wx.T._
    this.setData({
      index: set('index'),
    })
  },
  onPullDownRefresh: function() {
    this.getProjects()
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
