var cfg = require("../../utils/cfg.js");

var app = getApp();

Page({
  data: {
    iconColor: ["rgb(0,255,255)"],
    projects: [],
    changelangs:[],
    lang: ['中文简体', 'English'],
    langIndex: 0,
    langCode: ['zh', 'en'],
    showData: [],
    jsonData: [{ zh: "首页", en: "Home" }, { zh: "我的", en: "Me" }],
  },
  onLoad: function() {
    this.getProjects();
    wx.setNavigationBarTitle({
      title: app.language('validator.indextitle')
    });
    this.setLang();
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
    })
    var that = this
    wx.getStorage({
      key: 'changelang',
      success: function(res) {
        that.setData({
          changelangs: res.data
        })
        app.getTabbarLang(that.data.changelangs)
      }
    })
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
    })
    wx.setStorage({
      key: "changelang",
      data: this.data.showData,
    })
    var arr = this.data.langCode[this.data.langIndex];
    app.setTabBarLang(arr, this.data.jsonData, this.data.showData);
  },
  setLang() {
    const set = wx.T._
    this.setData({
      index: set('index'),
    })
  },
  // taskdetailTap: function(e) {
  //   console.log(this.data.projects)
  //   var id = e.detail.currentTarget
  //   wx.setStorage({
  //     key: "taskdetail",
  //     data: this.data.projects[id],
  //   })
  //   wx.navigateTo({
  //     url: '../task_detail/index?taskid=' + this.data.projects[id].TaskID,
  //   })
  // },
  filterSopType: function(tasklist) {
    var tmp = []
    for(var k in tasklist) {
      if (tasklist[k].sopType.indexOf("COLLECT") != -1 ||
          tasklist[k].sopType.indexOf("TEXTTRANS") != -1) {
          tmp.push(tasklist[k])
      }
    }
    return tmp
  },
  getProjects: function() {
    var that = this
    wx.request({
      url: cfg.getAPIURL()+"/api/projects",
      method: "get",
      header: app.globalData.header,
      success: function(response){
        that.setData({
          projects: that.filterSopType(response.data.projects)
        });
      },
      fail: function(response) {
        console.log(response)
         wx.showToast({
          title: app.language('validator.taskfailture'),
          icon: "none",
          duration: 1500
        });
      } 
    });
  },
  onPullDownRefresh: function() {
    this.getProjects()
    wx.showToast({
      title: app.language('validator.loading'),
      icon: "loading",
      duration: 1000
    });
    // wx.stopPullDownRefresh();
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
