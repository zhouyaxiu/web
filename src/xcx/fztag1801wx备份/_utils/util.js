var cfg = require("./cfg.js");
var app = getApp()

function formatTime(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isTel(tel) {
  return /^1(\d{10})$/.test(tel);
}

function request(method, url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data,
      method,
      header: {
        "Authorization": app.getCookie(),
        "Content-Type": "application/json;charset=utf-8",
      },
      success(res) {
        resolve(res)
      },
      fail() {
        reject({
          msg: '请求失败',
          code: -1,
        })
      }
    })
  });
}

// function getUploadToken(taskid, filename, curid) {
//   wx.request({
//     url: cfg.getFHDomain() + "/taskctl/uploadtoken",
//     data: {
//       sid: app.getCookie(),
//       taskid: taskid,
//       filename: filename,
//     },
//     method: "post",
//     header: {
//       "Authorization": app.getCookie(),
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     success: function (res) {
//       if (res.data.key !== "" && res.data.token !== "") {
//         console.log(filename, res.data.key, res.data.token)
//         return res.data.key, res.data.token
//       } else {
//         return "", ""
//       }
//     },
//     fail: function (res) {
//       return "", ""
//     }
//   });
// }
function upload(that, index, tempFile,taskid,canupload,data,account) {
  canupload = false
  cfg.wxPromise(wx.request)({
    url: cfg.getAPIURL() + "/api/projects/" + taskid + "/token",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    data: {
      taskid: taskid,
      filename: tempFile,
    },
  })
    .then(response => {
      if (response.data.code === 0) {
        doUpload(that, index, tempFile, response.data.key, response.data.token,data)
      } else {
        cfg.titleToast(app.language('validator.tokenfailture'))
      }
    })
    .catch(error => {
      cfg.titleToast(app.language('validator.taskfailture'))
    })
}

function doUpload(that, index, tempFile, key, token,canupload,data,account) {
  // 交给七牛上传
  console.log("开始上传");
  qiniuUploader.upload(tempFile,
    function (res) {
      console.log("上传完成", key);
      canupload = true
      data[index].key = key;
      data[index].imgsrc = 'https://s301.fanhantech.com/' + key;
      data[index].progress = 0;
      that.setData({
        data: data,
      })
      let temp = {
        type: data[index].type,
        raw: res.imageURL,
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      }
      if (account !== 0) {
        if (data[account - 1]) {
          data[account - 1] = temp
        } else {
          data.push(temp)
        }
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
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    header: app.globalData.header,
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
          uuid: response.data.questions[0].uuid,
          data: data,
        });
      } else {
        cfg.titleToast(response.data.message)
      }
    })
    .catch(error => {
      cfg.titleToast("error")
    })

  // wx.request({
  //   url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
  //   method: "get",
  //   header: app.globalData.header,
  //   success :response=> {
  //     var data = that.data.data;
  //     for (var i = 0, len = data.length; i < len; ++i) {
  //       data[i].imgsrc = ""
  //       data[i].key = ""
  //       data[i].progress = 0
  //     }
  //     if (response.data.code === 0) {
  //       that.setData({
  //         uuid: response.data.questions[0].uuid,
  //         data: data,
  //       });
  //       // that.getTask()
  //     } else {
  //       cfg.titleToast(response.data.message)
  //     }
  //   },
  //   fail: error=> {
  //     wx.showToast({
  //       title: "error",
  //       icon: "loading",
  //       duration: 2000
  //     });
  //   }
  // });
}

// function formatTime(micro_second) {
//   var second = Math.floor(micro_second / 1000);
//   // 小时位
//   var hr = Math.floor(second / 3600);
//   // 分钟位
//   var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
//   // 秒位
//   var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
//   // 毫秒位，保留2位
//   var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

//   return min + ":" + sec + "." + micro_sec;
// }


// function fill_zero_prefix(num) {
//   return num < 10 ? "0" + num : num
// }
module.exports = {
  formatTime: formatTime,
  isTel: isTel,
  request: request,
  doUpload,
  upload,
  getUUID
}