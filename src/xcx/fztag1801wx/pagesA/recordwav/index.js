const regeneratorRuntime = require('../../utils/regenerator');
const qiniuUploader = require("../../utils/qiniuUploader");
var cfg = require("../../utils/cfg.js");
var util = require("../../utils/util.js");
var app = getApp();

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

// var tempFilePath // 音频文件的本地临时路径
var recordTimeInterval
var startTime, endTime;
var taskid = ""

Page({
  data: {
    task_title: '文本',
    task_info: `Here’s to the crazy ones.
The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things differently.`,

    cdnkey: '',
    sop: '',
    uuid: '',
    tempFile: {}, // 音频文件的本地临时路径
    // 
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00.00',
    formatedPlayTime: '00:00.00',
    recordTimeInterval: 0,
    // ..
    isPlaying: false,
    startPlay: false,
    disabled: true,
    reStart: true,
    showTime: false,
    opacity: false,
    disableNext: true,
    process: ''
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
    wx.getStorage({
      key: 'langIndex',
      success: function(res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      recordwav: set('recordwav'),
    })
  },
  submit: function (e) {
    if (this.data.progress !== "") {
      wx.showToast({
        title: app.language('validator.uploading'),
        icon: "none",
        duration: 2000
      });
      return
    }
    console.log("submit begin");
    sop = this.data.sop
    uuid = this.data.uuid

    var res = {}
    res.key = this.data.cdnkey
    res.filename = this.data.tempFile['tempFilePath']
    res.filesize = this.data.tempFile['fileSize']
    res.duration = this.data.tempFile['duration']
    res.equip = "wechat"
    res.name = ""
    res.address = ""
    res.language = ""
    var that = this
    submitWorker(that, res)
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
    //开始录音
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              recorderManager.start(options);
              recorderManager.onStart(function(res) {
                console.log('recorder start');
                recordTimeInterval = setInterval(function () {
                  var recordTime = that.data.recordTime += 10;
                  that.setData({
                    isPlaying: true,
                    formatedRecordTime: formatTime(that.data.recordTime),
                    recordTime: recordTime,
                    reStart: true,
                    disableNext: true,
                    opacity: false,
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
                  // if (res.confirm) {
                  //   wx.getSetting({
                  //     success(res) {
                  //       console.log('222')
                  //       if (!res.authSetting['scope.record']) {
                  //         wx.authorize({
                  //           scope: 'scope.record',
                  //           success() {
                  //             wx.showModal({
                  //               title: app.language('validator.tips'),
                  //               content: app.language('validator.notused'),
                  //               showCancel: false,
                  //             })
                  //           }
                  //         })
                  //       } else {
                  //         console.log('授权成功')
                  //       }
                  //     },
                  //     fail(res) {
                  //       console.log(res)
                  //     }
                  //   })
                  // }
                }
              })
            }
          })
        } else {
          recorderManager.start(options);
          recorderManager.onStart(function(res) {
            console.log('recorder start');
            recordTimeInterval = setInterval(function () {
              var recordTime = that.data.recordTime += 10;
              that.setData({
                isPlaying: true,
                formatedRecordTime: formatTime(that.data.recordTime),
                recordTime: recordTime,
                reStart: true,
                disableNext: true,
                opacity: false,
              })
            }, 10)
          });
        }
      },
      fail() {
        console.log("授权设置录音失败")
      }
    })
    // wx.authorize({
    //   scope: 'scope.record',
    //   success() {
    //     that.setData({
    //       status: 2
    //     })
    //     recorderManager.start(options);
    //     recorderManager.onStart(function(res) {
    //       console.log('recorder start');
    //       recordTimeInterval = setInterval(function () {
    //         var recordTime = that.data.recordTime += 10;
    //         that.setData({
    //           isPlaying: true,
    //           formatedRecordTime: formatTime(that.data.recordTime),
    //           recordTime: recordTime,
    //           reStart: true,
    //           disableNext: true,
    //           opacity: false,
    //         })
    //       }, 10)
    //     });
    //   },
    //   fail() {
    //     wx.showModal({
    //       title: app.language('validator.tips'),
    //       content: app.language('validator.notused'),
    //       showCancel: true,
    //       confirmText: app.language('validator.rerecord'),
    //       confirmColor: "#52a2d8",
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.openSetting({
    //             success: function(res) {
    //               console.log(res.authSetting);
    //               if (!res.authSetting['scope.record']) {
    //                 // 未设置录音授权
    //                 console.log("未设置录音授权");
    //                 wx.showModal({
    //                   title: app.language('validator.tips'),
    //                   content: app.language('validator.notused'),
    //                   showCancel: false,
    //                   success: function (res) { },
    //                 })
    //               } else {
    //                 // 第二IC才成功授权
    //                 console.log("设置录音授权成功");
    //                 that.setData({
    //                   status: 2,
    //                 })
    //               }
    //             },
    //             fail: function () {
    //               console.log("授权设置录音失败")
    //             }
    //           })
    //         } else if (res.cancel) {
    //           console.log("cancel")
    //         }
    //       },
    //       fail: function () {
    //         console.log("openfail")
    //       }
    //     })
    //   }
    // })
    //错误回调
    recorderManager.onError(function(res) {
      console.log(res);
    })
  },

  //停止录音
  stopRecord: function (e) {
    clearInterval(recordTimeInterval);
    recorderManager.stop();
    recorderManager.onStop(function(res) {
      console.log(res)
      clearInterval(recordTimeInterval);
      this.setData({
        isPlaying: true,
        tempFile: res,
        disabled: false,
        reStart: false,
        startPlay: false,
        disableNext: false,
        opacity: true
      })
      this.tempFilePath = res.tempFilePath;
      innerAudioContext.src = res.tempFilePath;
      console.log("uploadFile start", this.data.taskid, res.tempFilePath)
      uploadFile(this, res.tempFilePath)
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
      innerAudioContext.onPlay(function(res) {
        that.setData({
          isPlaying: true,
          startPlay: true,
          disabled: false,
          reStart: true,
          showTime: true,
          opacity: true,
          disableNext: true
        })
      })
    } else {
      innerAudioContext.pause()
      innerAudioContext.onPause(function(res) {
        that.setData({
          isPlaying: true,
          startPlay: false,
          disabled: false,
          reStart: false,
          opacity: true,
          disableNext: false
        })
      })
    }
    innerAudioContext.onTimeUpdate(function(res) {
      var that = this
      var playTime = innerAudioContext.currentTime * 1000
      that.setData({
        formatedPlayTime: formatTime(that.data.playTime),
        playTime: playTime,
        disabled: false,
      })
    })
    innerAudioContext.onEnded(function(res) {
      var that = this
      that.setData({
        startPlay: false,
        disabled: false,
        reStart: false,
        disableNext: false,
        formatedPlayTime: formatTime(that.data.recordTime),
      })
    })
    innerAudioContext.onError(function(res) { })
  },

  reStart: function () {
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
            playTime: 0,
            disabled: true,
            opacity: false,
            reStart: true,
            showTime: false,
            disableNext: true
          })
        } else if (res.cancel) { }
      }
    })
  }
});

function submitWorker(that, sop) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    data: {
      id: that.data.taskid,
      uuid: that.data.uuid,
      result: JSON.stringify(res),
    },
    method: "POST",
    header: app.globalData.header,
    success: function(res) {
      // console.log(res)
      wx.showToast({
        title: "提交成功",
        icon: "success",
        duration: 1000
      });
      getUUID(that) // 重新获取任务
    },
    fail: function(res) {
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
    success: function(response) {
      var question = response.data.questions[0]
      var task_info_tmp
      if (typeof (question.prev) == "undefined") {
        task_info_tmp = `Here’s to the crazy ones.`
      } else {
        task_info_tmp = result.data.sop.SopCom.prev
      }
      that.setData({
        cdnkey: '',
        uuid: question.uuid,
        tempFile: {}, // 音频文件的本地临时路径
        task_info: task_info_tmp,
        // 
        recordTime: 0,
        playTime: 0,
        formatedRecordTime: '00:00.00',
        formatedPlayTime: '00:00.00',
        recordTimeInterval: 0,
        // ..
        isPlaying: false,
        startPlay: false,
        disabled: true,
        reStart: true,
        showTime: false,
        opacity: false,
        disableNext: true
      });
    },
    fail: function(response) {
      wx.showToast({
        title: "error",
        icon: "loading",
        duration: 2000
      });
    }
  });
}

function uploadFileWorker(that, filePath, key, token) {
  var that = this
  // 交给七牛上传
  qiniuUploader.upload(filePath,function(res) {
      that.setData({
        cdnkey: key
      });
      // wx.showToast({
      //   title: "上传成功",
      //   icon: "success",
      //   duration: 1000
      // });
    },
    function(error) {
      console.error("error: " + JSON.stringify(error));
    }, { // hard coding seapub_todo
      region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
      uptoken: token,
      key: key,
      shouldUseQiniuFileName: false,
      domain: "https://s301.fanhantech.com"
    },
    function(progress) {
      that.setData({
        progress: progress.progress
      });
      if (that.data.progress === 100) {
        setTimeout(function() {
          that.setData({
            progress: ''
          })
        }, 1000)
      }
      // console.log("上传进度", progress.progress);
      // console.log("已经上传的数据长度", progress.totalBytesSent);
      // console.log(
      //   "预期需要上传的数据总长度",
      //   progress.totalBytesExpectedToSend
      // );
    },
    function(cancelTask) {
      that.setData({
        cancelTask
    })}
  );

}

function uploadFile(that, filename) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/token",
    data: {
      taskid: that.data.taskid,
      filename: filename,
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    success: function (res) {
      if (res.data.code === 0) {
        uploadFileWorker(that, filename, res.data.key, res.data.token)
      } else {
        wx.showToast({
          title: app.language('validator.uploadfail'),
          icon: "none",
          duration: 1500
        });
      }
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