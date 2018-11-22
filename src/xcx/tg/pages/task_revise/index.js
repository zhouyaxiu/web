const qiniuUploader = require("../../utils/qiniuUploader");
var cfg = require("../../utils/cfg.js");
var app = getApp();
var recordTimeInterval;
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    wholeCfg: {},//选择
    itemCfg: {},//填空
    data: [],//表情
    allaccount: '',
    account: 0,
    wholeRadioContents: [],//用户输入数据单选
    wholeCheckBoxContents: [[]],//用户输入数据多选
    wholeInputContents: [],//用户输入数据填空,
    isPlaying: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00.00',
    formatedPlayTime: '00:00.00',
    tempFile: {}, // 音频文件的本地临时路径,
    startPlay: false,
    playprocess: 0,
    query:{
      status:'',
      taskid:'',
      uuid:''
    },
    canupload: true,
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
  },
  onLoad(options) {
    this.data.taskid = options.taskid;
    this.data.query={
      status: options.status,
      taskid: options.taskid,
      uuid: options.uuid,
    }
    this.getTask();
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    var that = this
    wx.getStorage({
      key: 'langIndex',
      success: function (res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    that.setLang()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      taskrevise: set('taskrevise'),
    })
  },
  onShow:function(){
    this.getTaskInfo();
  },
  getTask() {
    var that = this;
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + '/pageCfg',
      method: "get",
      header: app.globalData.header,
      success: function (response) {
        if (response.data.code === 0) {
          that.setData({
            wholeCfg: response.data.wholeCfg,
            itemCfg: response.data.itemCfg,
            data: response.data.data,
            allaccount: response.data.data.length
          });
          for (let i = 0; i < that.data.wholeCfg.tagMutexLabels.length; i++) {
            for (let j = 0; j < that.data.wholeCfg.tagMutexLabels[i].labels.length; j++) {
              that.data.wholeCfg.tagMutexLabels[i].labels[j].checked = false
            }
          }
        } else {
          wx.showToast({
            title: response.data.message,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (response) {
        wx.showToast({
          title: app.language('validator.taskerror'),
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  getTaskInfo() {
    var that = this;
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task/review?"+ 'taskid='+that.data.query.taskid+'&uuid='+that.data.query.uuid+'&status='+that.data.query.status,
      method: "get",
      header: app.globalData.header,
      success: function (response) {
        if (response.data.code === 0) {
          let result=JSON.parse(response.data.questions[0].res)
          let comment=''
          if(response.data.questions[0].comment!==""){
            comment=JSON.parse(response.data.questions[0].comment);
          }
          if(that.data.account===0){
            var tempdata = that.data.data;
            for(let i=0;i<tempdata.length;i++){
              if(result.data.length===0){
                tempdata[i].imgsrc=""
              }else{
                tempdata[i].imgsrc = result.data[i].raw;
              }
            }
            that.setData({
              data: tempdata,
              wholeRadioContents:result.wholeRadioContents,
              wholeInputContents:result.wholeInputContents,
              comment:comment
            });
            if(that.data.wholeCfg.hasOwnProperty('tagMutexLabels') && that.data.wholeCfg.tagMutexLabels.length>0 && that.data.wholeRadioContents.length !==0){
              for (let i = 0; i < that.data.wholeCfg.tagMutexLabels.length; i++) {
                if(that.data.wholeRadioContents.hasOwnProperty(i)){
                  that.data.wholeCfg.tagMutexLabels[i].labels[that.data.wholeRadioContents[i]].checked = true
                }
                that.setData({
                  'wholeCfg.tagMutexLabels': that.data.wholeCfg.tagMutexLabels
                })
              }
            }
            if (that.data.wholeCfg.hasOwnProperty('tagNormalLabels') && that.data.wholeCfg.tagNormalLabels.length > 0 && that.data.wholeRadioContents.length !==1) {
              for (let i in that.data.wholeCfg.tagNormalLabels) {
                if(that.data.wholeCheckBoxContents.hasOwnProperty(i)){
                  for(let j in that.data.wholeCheckBoxContents[i]){
                    that.data.wholeCfg.tagNormalLabels[i].labels[that.data.wholeCheckBoxContents[i][j]].checked = true
                  }
                }
                that.setData({
                  'wholeCfg.tagNormalLabels': that.data.wholeCfg.tagNormalLabels
                })
              }
            }
          }
        } else {
          wx.showToast({
            title: response.data.message,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (response) {
        wx.showToast({
          title: app.language('validator.taskerror'),
          icon: 'none',
          duration: 1000
        });
      }
    });
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
    this.data.wholeCheckBoxContents[index] = e.detail.value.map(Number);
    for (let j = 0; j < this.data.wholeCfg.tagNormalLabels[index].labels.length; j++) {
      if(this.data.wholeCheckBoxContents[index].indexOf(j)>-1){
        this.data.wholeCfg.tagNormalLabels[index].labels[j].checked=true
      }else{
        this.data.wholeCfg.tagNormalLabels[index].labels[j].checked=false
      }
    }
    this.setData({
      'wholeCfg.tagNormalLabels': this.data.wholeCfg.tagNormalLabels
    })
  },
  choiceTextInput: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.wholeInputContents[index] = e.detail.value;
    for(let i=0;i<this.data.wholeInputContents.length;i++){
      if(this.data.wholeInputContents[i]==='' || this.data.wholeInputContents[i]===undefined){
        this.data.wholeInputContents[i]=''
      }
    }
    this.setData({
      wholeInputContents: this.data.wholeInputContents
    })
  },
  bindVideo: function (e) {
    let index = e.currentTarget.dataset.index;
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: ['front', 'back'],
      success: function (res) {
        upload(that, index, res.tempFilePath)
      }
    })
  },
  bindClose:function(e){
    let index = e.currentTarget.dataset.index;
    var reduceimg='data[' + index + '].imgsrc'
    this.setData({
      [reduceimg]:''
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
        validate: this.data.wholeCfg.hasOwnProperty('TextInputs') && this.data.wholeInputContents.length !== this.data.wholeCfg.TextInputs.length || this.data.wholeInputContents.indexOf("") > -1,
        message: app.language('validator.blanknotempty')
      }],
      wholeCheckBoxContents: [{
        validate: this.data.wholeCfg.hasOwnProperty('tagNormalLabels') && this.data.wholeCheckBoxContents.length !== this.data.wholeCfg.tagNormalLabels.length,
        message: app.language('validator.multiplenotempty')
      }],
      img: [{
        validate: this.data.account !== 0 && (this.data.data[this.data.account - 1].hasOwnProperty('imgsrc') === false || this.data.data[this.data.account-1].imgsrc ===''),
        message: app.language('validator.pleaseupload') + message
      }]
    }
    for (var key in rule) {
      for (var i in rule[key]) {
        if (rule[key][i].validate) {
          wx.showToast({
            title: rule[key][i].message,
            icon: 'none',
            duration: 1000
          });
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
        account: this.data.account + 1,
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
  submit: function () {
    var that = this
    let result={}
    let data=[]
    for(let i=0;i<that.data.data.length;i++){
       let temp = {
        type: that.data.data[i].type,
        raw: that.data.data[i].imgsrc,
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      }
      data.push(temp)
    }
    result["data"] = data;
    result["wholeRadioContents"] = that.data.wholeRadioContents;
    result["wholeCheckBoxContents"] = that.data.wholeCheckBoxContents;
    result["wholeInputContents"] = that.data.wholeInputContents;
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task/revise?"+ 'taskid='+that.data.query.taskid+'&uuid='+that.data.query.uuid+'&status='+that.data.query.status,
      data: {
        result: JSON.stringify(result),
        uuid: that.data.query.uuid,
        id: that.data.query.taskid
      },
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        if (res.data.code === 0) {
          wx.showToast({
            title: app.language('validator.submission_success'),
            icon: "success",
            duration: 1000
          });
          setTimeout(function () {
            // wx.navigateTo({
            //   url: '../task_detail/index?taskid=' + that.data.taskid,
            // })
            wx.navigateBack({
              delta:2
            })
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "error",
          icon: "loading",
          duration: 2000
        });
      }
    });
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