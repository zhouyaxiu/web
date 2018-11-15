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

module.exports = {
  formatTime: formatTime,
  isTel: isTel
}