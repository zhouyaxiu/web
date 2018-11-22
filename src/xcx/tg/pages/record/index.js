const regeneratorRuntime = require('../../utils/regenerator');
const qiniuUploader = require("../../utils/qiniuUploader");
var cfg = require("../../utils/cfg.js");
var util = require("../../utils/util.js");
var app = getApp();

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

var recordTimeInterval
var taskid = "", uploadData = {}, uploadList = [], uploadTimeList = [], frontTime = ''
Page({
  data: {
    task_title: '文本',
    task_info: `Here’s to the crazy ones.
The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things differently.`,
    cdnkey: '',
    sop: {},
    uuid: '',
    tempFile: {}, // 音频文件的本地临时路径
    recordTime: 0,
    formatedRecordTime: '00:00.00',
    recordTimeInterval: 0,
    reStart: true,
    finish: true,
    process: 0,
    account: 1,
    allaccount: 2,
    status: 1,
    bindtap: ''
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    this.setData({
      taskid: options.taskid,
    })
    console.log(this.data.taskid)
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    wx.getStorage({
      key: 'langIndex',
      success: function (res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang();
    getUUID(that);
  },
  setLang() {
    const set = wx.T._
    this.setData({
      record: set('record'),
    })
  },

  startRecord: function (e) {
    this.setData({
      formatedRecordTime: '00:00.00',
      recordTime: 0,
    })
    // https://developers.weixin.qq.com/miniprogram/dev/api/getRecorderManager.html
    const options = {
      duration: 600000, //指定录音的时长，单位 ms
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
              recorderManager.start(options);
              recordTimeInterval = setInterval(function () {
                var recordTime = that.data.recordTime += 10;
                that.setData({
                  formatedRecordTime: formatTime(that.data.recordTime),
                  recordTime: recordTime,
                  status: 2,
                  reStart: true,
                  finish: true
                })
              }, 10)
            },
            fail() {
              wx.showModal({
                title: app.language('validator.tips'),
                content: app.language('validator.notused'),
                showCancel: false,
                success: function () {
                  wx.navigateTo({
                    url: '../setting/index',
                  })
                }
              })
            }
          })
        } else {
          recorderManager.start(options);
          recordTimeInterval = setInterval(function () {
            var recordTime = that.data.recordTime += 10;
            that.setData({
              formatedRecordTime: formatTime(that.data.recordTime),
              recordTime: recordTime,
              reStart: true,
              status: 2,
              reStart: true,
              finish: true
            })
          }, 10)
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
  pauseRecord: function () {
    var that = this;
    clearInterval(recordTimeInterval);
    recorderManager.pause();
    console.log('暂停录音啦11');
    that.setData({
      status: 3,
      reStart: false,
      finish: false
    })
  },
  resumeRecord: function () {
    var that = this;
    recorderManager.resume();
    console.log('继续录音啦11');
    recordTimeInterval = setInterval(function () {
      var recordTime = that.data.recordTime += 10;
      that.setData({
        formatedRecordTime: formatTime(that.data.recordTime),
        recordTime: recordTime,
        status: 2,
        reStart: true,
        finish: true
      })
    }, 10)
  },
  //停止录音
  stopRecord: function (e) {
    var that = this
    clearInterval(recordTimeInterval);
    that.setData({
      formatedRecordTime: formatTime(that.data.recordTime),
      recordTime: that.data.recordTime,
      status: 4,
      reStart: false,
      finish: true
    });
    recorderManager.stop();
    recorderManager.onStop(function (res) {
      console.log('停止录音啦');
      uploadTimeList.push(res.duration);
      console.log(uploadTimeList[Number(that.data.account) - 1])
      clearInterval(recordTimeInterval);
      that.setData({
        tempFile: res
      })
      that.tempFilePath = res.tempFilePath;
      innerAudioContext.src = res.tempFilePath;
      console.log("uploadFile start", that.data.taskid, res.tempFilePath)
      getUploadToken(that, that.data.taskid, res.tempFilePath);
    });
  },
  //播放声音
  playRecord: function () {
    clearInterval(recordTimeInterval);
    var that = this
    if (innerAudioContext.paused) {
      if (uploadList[Number(that.data.account) - 1].imageURL !== '') {
        console.log(uploadList[Number(that.data.account) - 1].imageURL, 'imageURL')
        innerAudioContext.src = uploadList[Number(that.data.account) - 1].imageURL
      } else {
        innerAudioContext.src = that.data.tempFile['tempFilePath']
      }
      innerAudioContext.play()
      console.log('开始播放了')
      that.setData({
        status: 5,
        reStart: true,
        finish: true
      })
    } else {
      innerAudioContext.stop()
      console.log('停止播放了')
      that.setData({
        status: 4,
        reStart: false,
        finish: true
      })
      console.log(stop)
    }
    innerAudioContext.onEnded(function (res) {
      console.log('結束播放了')
      that.setData({
        status: 4,
        reStart: false,
        finish: true
      })
    })
  },
  pausePlay: function () {
    var that = this
    innerAudioContext.pause()
    console.log('暂停播放了')
    that.setData({
      status: 4,
      reStart: false,
      finish: true
    })
    innerAudioContext.onEnded(function (res) {
      console.log('结束播放了')
      that.setData({
        status: 4,
        reStart: true,
        finish: true
      })
    })
  },
  reStart: function () {
    var that = this;
    wx.showModal({
      title: app.language('validator.tips'),
      content: app.language('validator.rerecord'),
      success: function (res) {
        if (res.confirm) {
          clearInterval(recordTimeInterval)
          uploadList.splice([Number(that.data.account) - 1], 1),
            uploadTimeList.splice([Number(that.data.account) - 1], 1),
            that.setData({
              tempFile: {},
              formatedRecordTime: '00:00.00',
              recordTime: 0,
              reStart: true,
              finish: true,
              // status: 1
            })
          that.startRecord()
        } else if (res.cancel) { }
      }
    })
  },
  frontTask: function () {
    var that = this;
    if (that.data.account > 1) {
      var newcount = Number(that.data.account) - 1;
      frontTime = uploadTimeList[newcount - 1];
      that.setData({
        account: newcount,
        formatedRecordTime: formatTime(frontTime),
        status: 4,
        reStart: true,
        finish: true
      })
    } else {
      console.log('已经是第一个了')
      return;
    }
  },
  nextTask: function () {
    var that = this;
    if (that.data.account < that.data.allaccount) {
      var newcount = Number(that.data.account) + 1
      if (uploadList[newcount - 2] === undefined || uploadList[newcount - 2] === []) {
        wx.showToast({
          title: '任务还没有提交'
        });
        console.log('任务提交')
        return;
      } else {
        frontTime = uploadTimeList[newcount - 1];
        if (frontTime === undefined || frontTime === '') {
          console.log(frontTime === undefined, '')
          getUUID(that);
          uploadData = {}
          that.setData({
            account: newcount,
            tempFile: {},
            formatedRecordTime: '00:00.00',
            recordTime: 0,
            status: 1,
            reStart: true,
            finish: true,
          })
        } else {
          that.setData({
            account: newcount,
            formatedRecordTime: formatTime(frontTime),
            status: 4,
            reStart: true,
            finish: true
          })
        }
      }
    } else {
      var newcount = Number(that.data.account) + 1
      if ((newcount - 1) === that.data.allaccount) {
        if (uploadList[newcount - 2] === undefined || uploadList[newcount - 2] === []) {
          wx.showToast({
            title: app.language('validator.tasknotsubmit')
          });
          console.log('任务还没有提交')
          return;
        } else {
          wx.showToast({
            title: app.language('validator.tashfull')
          })
          // if (this.data.progress !== "") {
          //   wx.showToast({
          //     title: app.language('validator.uploading'),
          //     icon: "none",
          //     duration: 2000
          //   });
          //   return
          // }
          var sop = that.data.sop;
          var uuid = that.data.uuid;
          var res = {};
          var templist = []
          for (var i = 0; i < uploadTimeList.length; i++) {
            templist.push({ time: uploadTimeList[i] })
          }
          for (let i = 0; i < uploadList.length; i++) {
            uploadList[i] = Object.assign(uploadList[i], templist[i]);
          }
          res.key = that.data.cdnkey;
          res.submitdata = uploadList;
          submitWorker(this, res)
          that.setData({
            formatedRecordTime: '00:00.00',
            recordTime: 0,
            status: 1,
            reStart: true,
            finish: true,
            account: 1,
          })
          frontTime = '',
          uploadList = [],
          uploadTimeList = [],
          console.log(frontTime,uploadList)
        }
      }
    }
  },
});

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
        icon: "none",
        duration: 1000
      });
      getUUID(that) // 重新获取任务
      that.setData({
        cdnkey: '',
        sop: '',
        uuid: ''
      })
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
      var question = res.data.questions[0];
      var task_info_tmp
      if (question.prev == "") {
        task_info_tmp = `Here’s to the crazy ones.`
      } else {
        task_info_tmp = question.prev
      }
      that.setData({
        cdnkey: '',
        uuid: question.uuid,
        tempFile: {}, // 音频文件的本地临时路径
        task_info: task_info_tmp,
        recordTime: 0,
        formatedRecordTime: '00:00.00',
        recordTimeInterval: 0,
        progress : 0
      });
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

function uploadFileWorker(that, filePath, key, token) {
  // 交给七牛上传
  qiniuUploader.upload(filePath, function (res) {
    that.setData({
      cdnkey: key
    });
    uploadData = {
      key: res.key,
      imageURL: res.imageURL,
      hash: res.hash
    }
    uploadList.push(uploadData)
    // wx.showToast({
    //   title: "上传成功",
    //   icon: "success",
    //   duration: 1000
    // });
  },
    function (error) {
      console.error("error: " + JSON.stringify(error));
    }, { // hard coding seapub_todo
      region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
      uptoken: token,
      key: key,
      shouldUseQiniuFileName: false,
      domain: "https://s301.fanhantech.com"
    },
    function (progress) {
      that.setData({
        progress: progress.progress
      });
      if (that.data.progress === 100) {
        setTimeout(function () {
          that.setData({
            progress: 0
          })
        }, 1000)
      }
      console.log("上传进度", progress.progress);
      console.log("已经上传的数据长度", progress.totalBytesSent);
      console.log(
        "预期需要上传的数据总长度",
        progress.totalBytesExpectedToSend
      );
    },
    function (cancelTask) {
      that.setData({
        cancelTask
      })
    }
  );

}

function getUploadToken(that, taskid, filename, curid) {
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
      console.log("success", res)
      if (res.data.key !== "" && res.data.token !== "") {
        var keytoken = { key: res.data.key, token: res.data.token };
        console.log('uploadFile', keytoken.key, keytoken.token)
        if (keytoken.key === "" || keytoken.token === "") {
          return
        }
        uploadFileWorker(that, filename, keytoken.key, keytoken.token)
        // return { key: res.data.key, token: res.data.token }
      } else {
        wx.showToast({
          title: app.language('validator.uploadfail'),
          icon: "none",
          duration: 1500
        });
        return { key: "", token: "" }
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