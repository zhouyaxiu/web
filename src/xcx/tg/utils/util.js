var cfg = require("./cfg.js");
const regeneratorRuntime = require('./regenerator');
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

module.exports = {
  formatTime: formatTime,
  isTel: isTel,
  request: request,
}