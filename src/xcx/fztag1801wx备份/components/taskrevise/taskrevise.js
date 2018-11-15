var cfg = require("../../utils/cfg.js");
var util = require("../../utils/util.js");
var event = require("../../utils/event.js");
var app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
var result = {}, data = [];
Component({
  options: {
    addGlobalClass: true
  },
  data: {
  },
  attached: function () {
    this.setData({
      canupload: true,
      allaccount: '',
      account: 0,
      wholeCfg: {},//选择
      itemCfg: {},//填空
      data: [],//表情
      wholeRadioContents: [],//用户输入数据单选
      wholeCheckBoxContents: [[]],//用户输入数据多选
      wholeInputContents: [],//用户输入数据填空,
      taskrevise: {
        results: app.language('taskrevise.results'),
        qualified: app.language('taskrevise.qualified'),
        failed: app.language('taskrevise.failed'),
        progress: app.language('taskrevise.progress'),
        nexttask: app.language('taskrevise.nexttask'),
        submit: app.language('taskrevise.submit'),
        lasttask: app.language('taskrevise.lasttask')
      },
      page:''
    })
    event.on('sendMsg', this, newMessage => {
      this.setData({
        query: newMessage
      })
      var pages = getCurrentPages()
      var page = pages[pages.length - 1].route
      switch (page) {
        case "pagesA/camera3/index":
          getUUID(this)
          break;
        case "pagesA/task_revise/index":
          this.setData({
            page:'revise'
          })
          this.getTask()
          this.getTaskInfo()
          break;
      }
    })
  },
  pageLifetimes: {
    show() { }
  },
  methods: {
    getTask() {
      cfg.wxPromise(wx.request)({
        url: cfg.getAPIURL() + "/api/projects/" + this.data.query.taskid + '/pageCfg',
        header: app.globalData.header,
      })
        .then(response => {
          if (response.data.code === 0) {
            this.setData({
              wholeCfg: response.data.wholeCfg,
              itemCfg: response.data.itemCfg,
              data: response.data.data,
              allaccount: response.data.data.length
            });
            for (let i = 0; i < this.data.wholeCfg.tagMutexLabels.length; i++) {
              for (let j = 0; j < this.data.wholeCfg.tagMutexLabels[i].labels.length; j++) {
                this.data.wholeCfg.tagMutexLabels[i].labels[j].checked = false
              }
            }
          } else {
            cfg.titleToast(response.data.message)
          }
        })
        .catch(error => {
          cfg.titleToast(app.language('validator.taskerror'))
        })
    },
    getTaskInfo() {
      cfg.wxPromise(wx.request)({
        url: cfg.getAPIURL() + "/api/projects/" + this.data.query.taskid + "/task/review?" + 'taskid=' + this.data.query.taskid + '&uuid=' + this.data.query.uuid + '&status=' + this.data.query.status,
        header: app.globalData.header,
      })
        .then(response => {
          if (response.data.code === 0) {
            let result = JSON.parse(response.data.questions[0].res);
            let comment = JSON.parse(response.data.questions[0].comment);
            if (this.data.account === 0) {
              var tempdata = this.data.data;
              for (let i in tempdata) {
                tempdata[i].imgsrc = result.data[i].raw;
                data = result.data;
                data[i].itemRadioContents = []
                data[i].itemCheckBoxContents = [[]]
                data[i].itemInputContents = []
              }
              this.setData({
                data: tempdata,
                wholeRadioContents: result.wholeRadioContents,
                wholeInputContents: result.wholeInputContents,
                comment: comment
              });
              if (this.data.wholeCfg.tagMutexLabels.length > 0) {
                for (let i in this.data.wholeCfg.tagMutexLabels) {
                  this.data.wholeCfg.tagMutexLabels[i].labels[this.data.wholeRadioContents[i]].checked = true
                  this.setData({
                    'wholeCfg.tagMutexLabels': this.data.wholeCfg.tagMutexLabels
                  })
                }
              }
            }
          } else {
            cfg.titleToast(response.data.message)
          }
        })
        .catch(error => {
          cfg.titleToast("validator.taskerror")
        })
    },
    choiceTagMutex (e) {
      let index = e.currentTarget.dataset.index;
      this.data.wholeRadioContents[index] = Number(e.detail.value);
      for (let j = 0; j < this.data.wholeCfg.tagMutexLabels[index].labels.length; j++) {
        this.data.wholeCfg.tagMutexLabels[index].labels[j].checked = j === Number(e.detail.value)
      }
      this.setData({
        'wholeCfg.tagMutexLabels': this.data.wholeCfg.tagMutexLabels
      })
    },
    choiceTagNormal (e) {
      let index = e.currentTarget.dataset.index;
      this.data.wholeCheckBoxContents[index] = Number(e.detail.value);
      for (let j = 0; j < this.data.wholeCfg.wholeCheckBoxContents[index].labels.length; j++) {
        this.data.wholeCfg.wholeCheckBoxContents[index].labels[j].checked = j === Number(e.detail.value)
      }
      this.setData({
        'wholeCfg.wholeCheckBoxContents': this.data.wholeCfg.wholeCheckBoxContents
      })
    },
    choiceTextInput: function (e) {
      let index = e.currentTarget.dataset.index
      this.data.wholeInputContents[index] = e.detail.value;
      this.setData({
        wholeInputContents: this.data.wholeInputContents
      })
    },
    // 开始拍照
    chooseImage: function (e) {
      if (!this.data.canupload) {
        cfg.titleToast(app.language('validator.uploading'))
        return
      }
      var index = e.currentTarget.dataset.id;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有 'original', 'compressed'
        sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
        // camera: 'front',
        success: res => {
          var tempFile = res.tempFilePaths[0];
          // 获取上传token
          upload(this, index, tempFile);
        },
        fail: error => {
          cfg.titleToast('error')
        }
      })
    },
    validate: function () {
      let message = ''
      if (this.data.account !== 0) {
        switch (this.data.data[this.data.account - 1].type) {
          case 1:
            message = app.language('validator.picture')
            break;
          case 2:
            message = app.language('validator.audio')
            break;
          case 3:
            message = app.language('validator.video')
            break;
          default:
            message = app.language('validator.picture')
            break;
        }
      }
      var rule = {
        wholeRadioContents: [{
          validate: this.data.wholeCfg.hasOwnProperty('tagMutexLabels') && this.data.wholeRadioContents.length !== this.data.wholeCfg.tagMutexLabels.length,
          message: app.language('validator.radionotempty')
        }],
        wholeInputContents: [{
          validate: this.data.wholeCfg.hasOwnProperty('TextInputs') && this.data.wholeInputContents.length !== this.data.wholeCfg.TextInputs.length,
          message: app.language('validator.blanknotempty')
        }],
        wholeCheckBoxContents: [{
          validate: this.data.wholeCfg.hasOwnProperty('tagNormalLabels') && this.data.wholeCheckBoxContents.length !== this.data.wholeCfg.tagNormalLabels.length,
          message: app.language('validator.multiplenotempty')
        }],
        img: [{
          validate: this.data.account !== 0 && this.data.data[this.data.account - 1].hasOwnProperty('imgsrc') === false,
          message: app.language('validator.pleaseupload') + message
        }]
      }
      for (var key in rule) {
        for (var i in rule[key]) {
          if (rule[key][i].validate) {
            cfg.titleToast(rule[key][i].message)
            return false
          }
        }
      }
      return true
    },
    nextTask: function () {
      if (this.validate()) {
        if (this.data.account === this.data.allaccount) {
          this.submit()
          return;
        }
        this.setData({
          account: this.data.account + 1
        })
      }
    },
    frontTask: function () {
      if (this.data.account > 0) {
        this.setData({
          account: this.data.account - 1
        })
      }
    },
    submit() {
      result["wholeRadioContents"] = this.data.wholeRadioContents;
      result["wholeCheckBoxContents"] = this.data.wholeCheckBoxContents;
      result["wholeInputContents"] = this.data.wholeInputContents;
      let url=''
      if(this.data.page==='revise'){
        url=cfg.getAPIURL() + "/api/projects/" + this.data.query.taskid + "/task/revise?"+ 'taskid='+this.data.query.taskid+'&uuid='+this.data.query.uuid+'&status='+this.data.query.status
      }else{
        url=cfg.getAPIURL() + "/api/projects/" + this.data.query.taskid + "/task"
      }
      cfg.wxPromise(wx.request)({
        url: url,
        data: {
          result: JSON.stringify(result),
          uuid: this.data.query.uuid,
          id: this.data.query.taskid
        },
        method: "POST",
        header: app.globalData.header
      })
        .then(response => {
          if (response.data.code === 0) {
            cfg.titleToast(app.language('validator.submission_success'))
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1000);
          } else {
            cfg.titleToast(response.data.message)
          }
        })
        .catch(error => {
          cfg.titleToast(app.language('validator.taskerror'))
        })
    }
  }
})
function upload(that, index, tempFile) {
  that.data.canupload = false
  cfg.wxPromise(wx.request)({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.query.taskid + "/token",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    data: {
      taskid: that.data.query.taskid,
      filename: tempFile,
    },
  })
    .then(response => {
      if (response.data.code === 0) {
        doUpload(that, index, tempFile, response.data.key, response.data.token)
      } else {
        cfg.titleToast(app.language('validator.tokenfailture'))
      }
    })
    .catch(error => {
      cfg.titleToast(app.language('validator.taskfailture'))
    })
}

function doUpload(that, index, tempFile, key, token) {
  // 交给七牛上传
  console.log("开始上传");
  qiniuUploader.upload(tempFile,
    function (res) {
      console.log("上传完成", key);
      that.data.canupload = true
      that.data.data[index].key = key;
      that.data.data[index].imgsrc = 'https://s301.fanhantech.com/' + key;
      that.data.data[index].progress = 0;
      that.setData({
        data: that.data.data,
      })
      let temp = {
        type: that.data.data[index].type,
        raw: res.imageURL,
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      }
      if(data[index]){
        data[index] = temp
      }else{
        data.push(temp)
      }
      result["data"] = data;
    },
    function (error) {
      console.log("上传失败", JSON.stringify(error));
    }, { // hard coding seapub_todo
      region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
      uptoken: token,
      key: key,
      shouldUseQiniuFileName: false,
      domain: "https://s301.fanhantech.com"
    },
    function (res) {
      console.log("上传进度", res.progress);
      var progress = 'data[' + index + '].progress'
      that.setData({
        [progress]: res.progress || 1,
      })
      if (res.progress === 100) {
        setTimeout(function () {
          that.setData({
            [progress]: 0,
          })
        }, 2000);
      }
    }
  );
}
function getUUID(that) {
  cfg.wxPromise(wx.request)({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.query.taskid + "/task",
    header:app.globalData.header,
  })
    .then(response => {
      var data = that.data.data;
      for (var i = 0, len = data.length; i < len; ++i) {
        data[i].imgsrc = ""
        data[i].key = ""
        data[i].progress = 0
      }
      if (response.data.code === 0) {
        that.setData({
          'query.uuid': response.data.questions[0].uuid,
          data: data,
        });
        that.getTask()
      } else {
        cfg.titleToast(response.data.message)
      }
    })
    .catch(error => {
      cfg.titleToast(app.language('validator.taskfailture'))
    })
}