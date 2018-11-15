var cfg = require("../../utils/cfg.js");
var app = getApp()
let query= {
  uuid: "",
  cuser: "",
  checkres: 999999,
  time: "",
  done: 999999,
  page: 1,
  pagesize: 10,
  totalPage:1,
  begin:0,
  end:0
};
Page({
  data: {
    tasks:[],
    showSkeleton:false
  },
  onLoad(options) {
    // setTimeout(() => {
		// 	this.setData({
		// 		showSkeleton: false
		// 	})
		// }, 3000)
    this.data.taskid=options.taskid;
    this.data.username=options.username;
    query.page=1
    this.getTasks();
    wx.setNavigationBarTitle({
      title: app.language('validator.tasktitle')
    });
    this.setLang();
  },
  getTasks () {
    cfg.wxPromise(wx.request)({
      url:cfg.getAPIURL()+"/api/projects/"+ this.data.taskid + "/task/reviews",
      header : app.globalData.header,
      method: "POST",
      data:{
        uuid: query.uuid,
        username:this.data.username,
        checkuser: query.cuser,
        checkres: query.checkres,
        done: query.done,
        page: query.page,
        pagesize: query.pagesize,
        totalpage:query.totalPage,
        begin: query.begin,
        end: query.end
      },
    })
    .then(response=>{
      if(response.statusCode===200 && response.data.code===0){
        this.setData({
          tasks: this.data.tasks.concat(response.data.tasks)
        });
        query.totalpage=response.data.pager.totalPage
        query.page=response.data.pager.page
        query.pagesize=response.data.pager.pageSize
      }else{
        cfg.titleToast(response.data.message)
      }
    })
    .catch(error=>{
      cfg.titleToast(app.language('validator.taskfailture'))
    })
  },
  setLang() {
    const set = wx.T._
    this.setData({
      my_submission: set('my_submission'),
    })
  },
  // bindRevise(e){
  //   let query={
  //     taskid:e.currentTarget.dataset.taskid,
  //     uuid:e.currentTarget.dataset.uuid,
  //     status:e.currentTarget.dataset.status,
  //   }
  //   wx.navigateTo({
  //     url: '../task_revise/index?'+'taskid='+query.taskid+'&uuid='+query.uuid+'&status='+query.status,
  //   })
  //   // event.emit('sendMsg',query)
  // },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    if (query.page < query.totalpage) {
      query.page=query.page+1
      this.getTasks()
    } else {
      cfg.titleToast(app.language('validator.loadingfinish'))
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.ShareAppTitle,
      desc:  app.globalData.ShareAppDesc,
      path: "/pages/index/index"
    };
  }
});
