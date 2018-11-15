var cfg = require("../../utils/cfg.js");
var config = require("../../utils/config.js");
var regeneratorRuntime = require("../../utils/runtime.js");
var event = require("../../utils/event.js");
var app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    projects: [],
    nodata: '',
    showSkeleton: true
  },
  attached: function () {
    //  wx.newWx.showLoading({title:'数据正在请求中'})
    //  .then(wx.newWx.hideLoading)
    // this.switchPage([this.getProjects(),this.getTasks()])
    var pages = getCurrentPages()
    var page = pages[pages.length - 1].route
    switch (page) {
      case "pages/index/index":
        this.getProjects()
        break;
      case "pagesA/my_task/index":
        this.getTasks()
        break;
    }
    this.setData({
      nodata: app.language('validator.nodata')
    })
  },
  methods: {
    switchPage: function ([a, b]) {
      var pages = getCurrentPages()
      var page = pages[pages.length - 1].route
      switch (page) {
        case "pages/index/index":
          return a
          break;
        case "pagesA/my_task/index":
          return b
          break;
      }
    },
    viewProject: function (e) {
      let id = e.currentTarget.dataset.id;
      // this.switchPage([wx.navigateTo({
      //   url: '../../pagesA/task_detail/index?taskid=' + id,
      // }), wx.navigateTo({
      //   url: '../../pagesA/task_revises/index?taskid=' + id,
      // })])
      var pages = getCurrentPages()
      var page = pages[pages.length - 1].route
      switch (page) {
        case "pages/index/index":
          wx.navigateTo({
            url: '../../pagesA/task_detail/index?taskid=' + id,
          })
          break;
          return;
        case "pagesA/my_task/index":
          wx.navigateTo({
            url: '../../pagesA/task_revises/index?taskid=' + id,
          })
          break;
      }
    },
    filterSopType: function (tasklist) {
      var tmp = []
      for (var k in tasklist) {
        if (tasklist[k].sopType.indexOf("COLLECT") != -1 ||
          tasklist[k].sopType.indexOf("TEXTTRANS") != -1) {
          tmp.push(tasklist[k])
        }
      }
      return tmp
    },
    async Projects(tempurl) {
      // wx.getStorage({
      //   key: 'projects',
      //   success: res=> {
      //     console.log(res,'resresres')
      //     this.setData({
      //       projects: res.data
      //     })
      //   }
      // })
     
      cfg.wxPromise(wx.request)({
        url: tempurl,
        header: app.globalData.header,
      })
        .then(res => {
          if (res.statusCode === 200) {
            if ((res.data.projects.length === 0) || (res.data.projects === null)) {
              cfg.titleToast(app.language('validator.nodata'))
            }
            // this.switchPage([this.setData({
            //   projects: this.filterSopType(res.data.projects)
            // }), this.setData({
            //   projects: res.data.projects
            // })])
            var pages = getCurrentPages()
            var page = pages[pages.length - 1].route
            switch (page) {
              case "pages/index/index":
                this.setData({
                  projects: this.filterSopType(res.data.projects)
                });
                break;
              default:
                this.setData({
                  projects: res.data.projects
                });
                break;
            }
            wx.setStorage({
              key: "projects",
              data: this.data.projects,
            })
          } else {
            cfg.titleToast(app.language('validator.loadingfature'))
          }
        })
    },
    getProjects () {
      let url = cfg.getAPIURL() + "/api/projects"
      this.Projects(url)
    },
    getTasks () {
      let url = cfg.getAPIURL() + "/api/projects?username=true"
      this.Projects(url)
    }
  }
})
