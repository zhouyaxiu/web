var cfg = require("../../utils/cfg.js");
var app = getApp();
var taskid = ""
Page({
  data: {
    temtest: `Q.9(4752174)
问题：这个是什么啊？求鉴定？
回答：痛苦他具体，毁我。
Q.10(4752453)
问题：这个核桃是什么品种？
回答：他肯五咯了，碌碌无为。`,
    tests: [],
    sop: {},
    uuid: "",
    checked: false,
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    getUUID(that)
    this.setData({
      taskid: options.taskid,
    })
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    this.setLang()
  },
  setLang(){
    const set=wx.T._
    this.setData({
      text_10qc:set('text_10qc'),
    })
  },
  // onLoad: function (options) {
  //   var strlist = parseQA(this.data.temtest)
  //   this.setData({
  //     tests: strlist
  //   })
  // },
  choiceObject: function (e) {
    var tests = this.data.tests;
    for (var i = 0; i < tests.length; i++) {
    };
    this.setData({ tests: tests });
  },
  submit: function (e) {
    var result = []
    this.data.result = Object.values(e.detail.value)
    for (var i = 0; i < this.data.result.length; i++) {
      if (this.data.result[i] == '') {
        wx.showToast({
          title: app.language('validator.optionnull'),
          icon: "none",
          duration: 1500
        });
        return
      }
    }
    console.log(this.data.result);
    var resa = this.data.result
    var resb = []
    for (var i = 0; i < resa.length; i++) {
      resb[i] = parseInt(resa[i])
    }
    sop = this.data.sop
    var resc = {}
    resc.wholeRadioContents = resb
    sop.SopText.res = JSON.stringify(resc)
    console.log(sop);
    var that = this
    submitWorker(that, resc)
  }
})
// 
function submitWorker(that, res) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    data: {
      id: that.data.taskid,
      uuid: that.data.uuid,
      result: JSON.stringify(res),
    },
    method: "POST",
    header: app.globalData.header,
    success: function (res) {
      wx.showToast({
        title: app.language('validator.submission_success'),
        icon: "success",
        duration: 1000
      });
      getUUID(that) // 重新获取任务
    },
    fail: function (res) {
      wx.showToast({
        title: app.language('validator.networkerror'),
        icon: "none",
        duration: 2000
      });
    }
  });
}


function getUUID(that) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    method: "get",
    header: app.globalData.header,
    success: function (res) {
      var strlist = parseQA(res.data.sop.SopText.raw)
      that.setData({
        sop: res.data.sop,
        uuid: res.data.questions[0].uuid,
        tests: strlist,
        checked: false,
      });
    },
    fail: function (res) {
      wx.showToast({
        title: app.language('validator.networkerror'),
        icon: "none",
        duration: 2000
      });
      console.log(res)
    }
  });
}

function parseQA(soptextraw) {
  console.log(soptextraw)
  var qalista = soptextraw.split("\n");
  var lena = qalista.length
  lena = parseInt(lena / 3) * 3
  qalista = qalista.slice(0, lena)
  var qalistb = []
  for (var i = 0; i < qalista.length; i++) {
    var j = parseInt(i / 3)
    if (i % 3 === 0) {
      qalistb[j] = {}
      qalistb[j].name = i
      qalistb[j].ansId = qalista[i]
    } else if (i % 3 === 1) {
      qalistb[j].question = qalista[i]
    } else {
      qalistb[j].answer = qalista[i]
    }
  }
  return qalistb
}
