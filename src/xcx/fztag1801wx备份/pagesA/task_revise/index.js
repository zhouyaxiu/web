const qiniuUploader = require("../../utils/qiniuUploader");
var event = require("../../utils/event.js");
var cfg = require("../../utils/cfg.js");
var app = getApp();
var result = {}, data = [];
var recordTimeInterval;
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    // wholeCfg: {},//选择
    // itemCfg: {},//填空
    // data: [],//表情
    // allaccount: '',
    // account: 0,
    // wholeRadioContents: [],//用户输入数据单选
    // wholeCheckBoxContents: [[]],//用户输入数据多选
    // wholeInputContents: [],//用户输入数据填空,
    isPlaying: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00.00',
    formatedPlayTime: '00:00.00',
    tempFile: {}, // 音频文件的本地临时路径,
    startPlay: false,
    playprocess: 0,
    // query:{
    //   status:'',
    //   taskid:'',
    //   uuid:''
    // },
    // status: '',
    // taskid: '',
    // uuid: '',
    canupload: true,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    videosrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
  },
  onLoad(options) {
    this.data.query={
      status: options.status,
      taskid: options.taskid,
      uuid: options.uuid,
    }
    event.emit('sendMsg',this.data.query)
    // this.getTask();
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    this.setLang()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      taskrevise: set('taskrevise'),
    })
  },
  onShow: function () {
    // this.getTaskInfo();
  },
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
        cfg.titleToast("error")
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
          if (this.data.account === 0) {
            var tempdata = this.data.data;
            for (let i = 0; i < tempdata.length; i++) {
              tempdata[i].imgsrc = result.data[i].raw;
              data = result.data;
              data[i].itemRadioContents = []
              data[i].itemCheckBoxContents = [[]]
              data[i].itemInputContents = []
            }
            this.setData({
              data: tempdata,
              wholeRadioContents: result.wholeRadioContents,
              wholeInputContents: result.wholeInputContents
            });
            if (this.data.wholeCfg.tagMutexLabels.length > 0) {
              for (let i = 0; i < this.data.wholeCfg.tagMutexLabels.length; i++) {
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
  choiceTagMutex: function (e) {
    let index = e.currentTarget.dataset.index;
    this.data.wholeRadioContents[index] = Number(e.detail.value);
    for (let j = 0; j < this.data.wholeCfg.tagMutexLabels[index].labels.length; j++) {
      this.data.wholeCfg.tagMutexLabels[index].labels[j].checked = j === Number(e.detail.value)
    }
    this.setData({
      'wholeCfg.tagMutexLabels': this.data.wholeCfg.tagMutexLabels
    })
  },
  choiceTagNormal: function (e) {
    let index = e.currentTarget.dataset.index;
    this.data.wholeCheckBoxContents[index] = Number(e.detail.value);
    for (let j = 0; j < this.data.wholeCfg.wholeCheckBoxContents[index].labels.length; j++) {
      if (j === Number(e.detail.value)) {
        this.data.wholeCfg.wholeCheckBoxContents[index].labels[j].checked = true
      }
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
  bindVideo: function (e) {
    let index = e.currentTarget.dataset.index;
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          videosrc: res.tempFilePath
        })
        upload(that, index, res.tempFilePath)
      }
    })
  },
  // 开始拍照
  chooseImage: function (e) {
    var that = this;
    if (!that.data.canupload) {
      wx.showToast({
        title: app.language('validator.uploading'), // 文件正在上传
        icon: "loading",
        duration: 2000
      });
      return
    }
    var index = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有 'original', 'compressed'
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      // camera: 'front',
      success: function (res) {
        var tempFile = res.tempFilePaths[0];
        // 获取上传token
        upload(that, index, tempFile);
      },
      fail: function () {

      }
    })
  },
  startRecord: function (e) {
    // https://developers.weixin.qq.com/miniprogram/dev/api/getRecorderManager.html
    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
      audioSource: 'auto' // 指定音频输入源
    }
    var that = this;
    that.setData({
      formatedRecordTime: '00:00.00',
      formatedPlayTime: '00:00.00',
      recordTime: 0,
      playTime: 0,
    })
    //开始录音
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              recorderManager.start(options);
              recorderManager.onStart(function (res) {
                console.log('recorder start');
                recordTimeInterval = setInterval(function () {
                  var recordTime = that.data.recordTime += 10;
                  that.setData({
                    isPlaying: true,
                    recordTime: recordTime,
                    formatedRecordTime: formatTime(that.data.recordTime)
                  })
                }, 10)
              });
            },
            fail() {
              wx.showModal({
                title: app.language('validator.tips'),
                content: app.language('validator.notused'),
                showCancel: false,
                success: function (res) {
                  wx.navigateTo({
                    url: '../setting/index',
                  })
                }
              })
            }
          })
        } else {
          recorderManager.start(options);
          recorderManager.onStart(function (res) {
            console.log('recorder start');
            recordTimeInterval = setInterval(function () {
              var recordTime = that.data.recordTime += 10;
              that.setData({
                isPlaying: true,
                recordTime: recordTime,
                formatedRecordTime: formatTime(that.data.recordTime)
              })
            }, 10)
          });

        }
      },
      fail() {
        console.log("授权设置录音失败")
      }
    })
    //错误回调
    recorderManager.onError(function (res) {
      console.log(res);
    })
  },

  //停止录音
  stopRecord: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    clearInterval(recordTimeInterval);
    recorderManager.stop();
    recorderManager.onStop(function (res) {
      console.log(res)
      clearInterval(recordTimeInterval);
      that.setData({
        isPlaying: false,
        tempFile: res,
      })
      that.tempFilePath = res.tempFilePath;
      innerAudioContext.src = res.tempFilePath;
      console.log("uploadFile start", that.data.taskid, res.tempFilePath)
      // uploadFile(this, res.tempFilePath)
      upload(that, index, res.tempFilePath);
    });
  },
  //播放声音
  playRecord: function () {
    clearInterval(recordTimeInterval);
    var that = this
    if (innerAudioContext.paused) {
      if (!this.data.startPlay) {
        innerAudioContext.src = this.data.tempFile['tempFilePath']
      }
      innerAudioContext.play()
      innerAudioContext.onPlay(function (res) {
        that.setData({
          isPlaying: false,
          startPlay: true
        })
      })
    } else {
      innerAudioContext.pause()
      innerAudioContext.onPause(function (res) {
        that.setData({
          isPlaying: false,
          startPlay: false
        })
      })
    }
    innerAudioContext.onTimeUpdate(function (res) {
      var playTime = innerAudioContext.currentTime * 1000;
      that.setData({
        formatedPlayTime: formatTime(playTime),
        playprocess: playTime / (that.data.recordTime) * 100
      })
      console.log(that.data.playprocess)
    })
    innerAudioContext.onEnded(function (res) {
      that.setData({
        formatedPlayTime: formatTime(that.data.recordTime),
        startPlay: false,
        playprocess: 100
      })
    })
    innerAudioContext.onError(function (res) { })
  },
  clearRecord: function () {
    var that = this;
    wx.showModal({
      title: app.language('validator.tips'),
      content: app.language('validator.rerecord'),
      success: function (res) {
        if (res.confirm) {
          clearInterval(recordTimeInterval)
          that.setData({
            isPlaying: false,
            tempFile: {},
            startPlay: false,
            formatedRecordTime: '00:00.00',
            formatedPlayTime: '00:00.00',
            recordTime: 0,
            playTime: 0
          })
        } else if (res.cancel) { }
      }
    })
  },
  nextTask: function () {
    if (this.data.account === this.data.allaccount) {
      this.submit()
      return;
    }
    this.setData({
      account: this.data.account + 1
    })
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
    result["data"] = data;
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + "/api/projects/" + this.data.query.taskid + "/task/revise?" + 'taskid=' + this.data.query.taskid + '&uuid=' + this.data.query.uuid + '&status=' + this.data.query.status,
      header: app.globalData.header,
      data: {
        result: JSON.stringify(result),
        uuid: this.data.query.uuid,
        id: this.data.query.taskid
      },
      method: "POST",
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
        cfg.titleToast("validator.taskerror")
      })
  }
});
function doUpload(that, index, tempFile, key, token) {
  // 交给七牛上传
  console.log("开始上传");
  qiniuUploader.upload(tempFile,
    function (res) {
      console.log("上传完成", key);
      that.data.canupload = true
      var tempdata = that.data.data;
      tempdata[index].key = key;
      tempdata[index].imgsrc = 'https://s301.fanhantech.com/' + key;
      tempdata[index].progress = 0;
      that.setData({
        data: tempdata,
      })
      let temp = {
        type: that.data.data[index].type,
        raw: res.imageURL,
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      }
      let submitdata = data;
      if (submitdata[index]) {
        submitdata[index] = temp
      } else {
        submitdata.push(temp)
      }
      data = data;
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
      var data = that.data.data;
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
function upload(that, index, tempFile) {
  that.data.canupload = false
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/token",
    data: {
      taskid: that.data.taskid,
      filename: tempFile,
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    success: function (res) {
      if (res.data.code === 0) {
        doUpload(that, index, tempFile, res.data.key, res.data.token)
      } else {
        wx.showToast({
          title: app.language('validator.tokenfailture'),
          icon: "loading",
          duration: 1500
        });
      }
    },
    fail: function (response) {
      wx.showToast({
        title: "error",
        icon: "loading",
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
    success: function (response) {
      var data = that.data.data;
      for (var i = 0, len = data.length; i < len; ++i) {
        data[i].imgsrc = ""
        data[i].key = ""
        data[i].progress = 0
      }
      if (response.data.code === 0) {
        that.setData({
          uuid: response.data.questions[0].uuid,
          data: data,
        });
        that.getTask()
      } else {
        wx.showToast({
          title: response.data.message,
          icon: "none",
          duration: 2000
        });
      }
    },
    fail: function (response) {
      wx.showToast({
        title: "error",
        icon: "loading",
        duration: 2000
      });
    }
  });
}

function formatTime(micro_second) {
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return min + ":" + sec + "." + micro_sec;
}


function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}